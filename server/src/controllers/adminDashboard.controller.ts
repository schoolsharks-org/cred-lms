import { NextFunction, Request, Response } from "express";
import WeeklyResponse from "../models/weeklyResponse.model";
import User from "../models/user.model";
import WeeklyQuestion from "../models/weeklyQuestion.model";

// Helper functions for date calculations
const getDateRange = (date: Date): { startOfWeek: Date; endOfWeek: Date } => {
  const dayOfWeek = date.getUTCDay();
  const startOfWeek = new Date(date);
  startOfWeek.setUTCDate(date.getUTCDate() - ((dayOfWeek + 6) % 7));
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

const getMonthRange = (
  date: Date
): { startOfMonth: Date; endOfMonth: Date } => {
  const startOfMonth = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const endOfMonth = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
  endOfMonth.setUTCHours(23, 59, 59, 999);

  return { startOfMonth, endOfMonth };
};

async function handleUserScores() {
  const { startOfWeek, endOfWeek } = getDateRange(new Date());

  const [weeklyQuestions, userWeeklyScorers] = await Promise.all([
    WeeklyQuestion.findOne({ date: startOfWeek }),
    WeeklyResponse.find({ startTime: { $gte: startOfWeek, $lte: endOfWeek } })
      .sort({ score: -1 })
      .select("score user")
      .limit(15)
      .lean(),
  ]);

  if (!weeklyQuestions) {
    return { TopScore: [], BelowAverageScore: [] };
  }

  const totalScore = Object.values(weeklyQuestions.analytics).reduce(
    (sum, item) =>
      sum + (typeof item.totalScore === "number" ? item.totalScore : 0),
    0
  );

  const userIds = userWeeklyScorers.map((res) => res.user);
  const users = await User.find({ _id: { $in: userIds } })
    .select("name department")
    .lean();

  const usersMap = new Map(users.map((user) => [user._id.toString(), user]));

  const processScores = (responses: typeof userWeeklyScorers) =>
    responses
      .map((response) => {
        const user = usersMap.get(response.user.toString());
        if (!user) return null;
        return {
          Name: user.name,
          Score: (response.score * 100) / totalScore,
          Department: user.department,
        };
      })
      .filter(Boolean);

  const topScorers = processScores(userWeeklyScorers.slice(0, 10));
  const belowAverageScorers = processScores(
    userWeeklyScorers.slice(-5).reverse()
  );

  return { TopScore: topScorers, BelowAverageScore: belowAverageScorers };
}

async function getInactiveUsersCount(days: number) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  return User.aggregate([
    {
      $lookup: {
        from: "dailyresponses",
        localField: "_id",
        foreignField: "user",
        as: "responses",
      },
    },
    {
      $match: {
        "responses.date": { $not: { $gte: dateLimit } },
      },
    },
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
  ]);
}

export const getUserCountForEachDepartment = () =>
  User.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }]);

const getTotalModules = () =>
  WeeklyQuestion.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } },
  ]);

async function calculateModulesCompletedPercentage() {
  const [departmentUserCounts, totalDepartmentModules, totalAnswersResult] =
    await Promise.all([
      getUserCountForEachDepartment(),
      getTotalModules(),
      WeeklyQuestion.aggregate([
        {
          $group: {
            _id: null,
            Sales: { $sum: "$analytics.Sales.totalAnswers" },
            Operations: { $sum: "$analytics.Operations.totalAnswers" },
            Collection: { $sum: "$analytics.Collection.totalAnswers" },
            Credit: { $sum: "$analytics.Credit.totalAnswers" },
            Others: { $sum: "$analytics.Others.totalAnswers" },
          },
        },
      ]),
    ]);

  const departmentUserCountsMap = new Map(
    departmentUserCounts.map((item) => [item._id, item.count])
  );
  const totalDepartmentModulesMap = new Map(
    totalDepartmentModules.map((item) => [item._id, item.count])
  );
  const totalAnswers: { [key: string]: number } = totalAnswersResult[0] || {};

  return Array.from(departmentUserCountsMap.keys()).map((department) => {
    const userCount = departmentUserCountsMap.get(department) || 0;
    const totalModules = totalDepartmentModulesMap.get(department) || 0;
    const totalAnswersForDepartment = totalAnswers[department] || 0;

    const percentage =
      totalModules === 0 || totalAnswersForDepartment === 0
        ? 0
        : ((userCount * totalModules) / totalAnswersForDepartment) * 100;

    return { department, count: percentage };
  });
}

async function getMonthlyAggregatedData() {
  const { startOfMonth, endOfMonth } = getMonthRange(new Date());

  const monthlyAggregation = await WeeklyQuestion.aggregate([
    {
      $match: { date: { $gte: startOfMonth, $lte: endOfMonth } },
    },
    {
      $group: {
        _id: null,
        ...["Sales", "Operations", "Collection", "Credit", "Others"].reduce(
          (acc, dept) => ({
            ...acc,
            [`${dept.toLowerCase()}BelowEighty`]: {
              $sum: `$analytics.${dept}.belowEighty`,
            },
            [`${dept.toLowerCase()}ProgressReattempt`]: {
              $sum: `$analytics.${dept}.progressReattempt`,
            },
            [`${dept.toLowerCase()}Reattempted`]: {
              $sum: `$analytics.${dept}.reattempted`,
            },
          }),
          {}
        ),
      },
    },
  ]);

  if (monthlyAggregation.length === 0) return null;

  const result = monthlyAggregation[0];
  return ["Sales", "Operations", "Collection", "Credit", "Others"].reduce(
    (acc, dept) => ({
      ...acc,
      [dept]: {
        belowEighty: result[`${dept.toLowerCase()}BelowEighty`] || 0,
        progressReattempt:
          result[`${dept.toLowerCase()}ProgressReattempt`] || 0,
        reattempted: result[`${dept.toLowerCase()}Reattempted`] || 0,
      },
    }),
    {}
  );
}

export const handleAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [
    userScores,
    sevenDaysInactiveUsers,
    fifteenDaysInactiveUsers,
    userCountofDepartment,
    getTotalDepartmentModules,
    modulesCompleted,
    monthlyAggregatedData,
  ] = await Promise.all([
    handleUserScores(),
    getInactiveUsersCount(7),
    getInactiveUsersCount(15),
    getUserCountForEachDepartment(),
    getTotalModules(),
    calculateModulesCompletedPercentage(),
    getMonthlyAggregatedData(),
  ]);

  return res.json({
    userScores,
    sevenDaysInactiveUsers,
    fifteenDaysInactiveUsers,
    userCountofDepartment,
    getTotalDepartmentModules,
    modulesCompleted,
    monthlyAggregatedData,
  });
};
