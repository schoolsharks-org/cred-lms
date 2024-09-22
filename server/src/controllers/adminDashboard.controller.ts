import { NextFunction, Request, Response } from "express";
import WeeklyResponse from "../models/weeklyResponse.model";
import User, { Department } from "../models/user.model";
import WeeklyQuestion from "../models/weeklyQuestion.model";

function getMondayOfCurrentWeek(date: Date): Date {
  const dayOfWeek = date.getUTCDay();
  const difference = (dayOfWeek + 6) % 7;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - difference);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

function getSundayOfCurrentWeek(date: Date): Date {
  const sunday = new Date(date);
  sunday.setUTCDate(date.getUTCDate() + (6 - ((date.getUTCDay() + 6) % 7)));
  sunday.setUTCHours(23, 59, 59, 999);
  return sunday;
}

async function handleUserScores() {
  const TodayDate = new Date();
  const startOfWeek = getMondayOfCurrentWeek(TodayDate);
  const endOfWeek = getSundayOfCurrentWeek(TodayDate);

  const weeklyQuestions = await WeeklyQuestion.findOne({
    date: startOfWeek,
  });

  const userWeeklyTopScorers = await WeeklyResponse.find({
    startTime: { $gte: startOfWeek, $lte: endOfWeek },
  }).sort({ score: -1 })
    .select("score user department")
    .limit(10);


  const TopScorers = [];
  if (weeklyQuestions) {
    const totalScore = Object.values(weeklyQuestions.toObject().analytics)
      .filter((item) => typeof item.totalScore === "number")
      .reduce((a, b) => a + b.totalScore, 0);
    for (const response of userWeeklyTopScorers) {
      const user = await User.findOne({ _id: response.user }).select("name department");
      if (user) {
        TopScorers.push({
          Name: user.name,
          Score: (response.score * 100) / totalScore,
          Department:user.department
        });
      }
    }
  }

  const userWeeklyBelowAverageScorers = await WeeklyResponse.find({
    startTime: { $gte: startOfWeek, $lte: endOfWeek },
  })
    .sort({ score: 1 })
    .select("score user department")
    .limit(5);

  const belowAvgScorers = [];
  if (weeklyQuestions) {
    for (const response of userWeeklyBelowAverageScorers) {
      const user = await User.findOne({ _id: response.user }).select("name department");

      if (user) {
        const totalScore = Object.values(weeklyQuestions.toObject().analytics)
          .filter((item) => typeof item.totalScore === "number")
          .reduce((a, b) => a + b.totalScore, 0);
        belowAvgScorers.push({
          Name: user.name,
          Score: (response.score * 100) / totalScore,
          Department:user.department
        });
      }
    }
  }

  return { TopScore: TopScorers, BelowAverageScore: belowAvgScorers };
}

async function getSevenDaysInactiveUsersCount() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const lastSevenDaysInactiveUsers = await User.aggregate([
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
        "responses.date": { $not: { $gte: sevenDaysAgo } },
      },
    },
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
  ]);

  return lastSevenDaysInactiveUsers;
}

async function getFifteenDaysInactiveUsersCount() {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  const lastFifteenDaysInactiveUsers = await User.aggregate([
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
        "responses.date": { $not: { $gte: fifteenDaysAgo } },
      },
    },
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
  ]);

  return lastFifteenDaysInactiveUsers;
}

export async function getUserCountForEachDepartment() {
  const departmentUserCounts = await User.aggregate([
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
  ]);
  // console.log("departmentUserCounts: ", departmentUserCounts);
  return departmentUserCounts;
}

async function getTotalModules() {
  const totalDepartmentModules = await WeeklyQuestion.aggregate([
    {
      $group: {
        _id: "$department",
        totalModules: { $count: {} },
      },
    },
  ]);
  return totalDepartmentModules.map(item => ({
    _id: item._id,
    count: item.totalModules
  }));
}
async function calculateModulesCompletedPercentage() {
  const departmentUserCounts = await getUserCountForEachDepartment();
  const totalDepartmentModules = await getTotalModules();

  const totalAnswersResult = await WeeklyQuestion.aggregate([
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
  ]);

  // Convert departmentUserCounts to a map for easier lookup
  const departmentUserCountsMap = departmentUserCounts.reduce<{ [key: string]: number }>((acc, item) => {
    acc[item.department] = item.count;
    return acc;
  }, {});

  // Convert totalDepartmentModules to a map for easier lookup
  const totalDepartmentModulesMap = totalDepartmentModules.reduce<{ [key: string]: number }>((acc, item) => {
    acc[item.count] = item.count || 0;
    return acc;
  }, {});

  // Extract total answers per department from aggregation result
  const totalAnswers: { [key: string]: number } = totalAnswersResult[0] || {};

  // Calculate completion percentages for each department
  const completionPercentages = Object.keys(departmentUserCountsMap).map((department) => {
    const userCount = departmentUserCountsMap[department];
    const totalModules = totalDepartmentModulesMap[department] || 0;
    const totalAnswersForDepartment = totalAnswers[department] || 0;

    const percentage =
      totalModules === 0 || totalAnswersForDepartment === 0
        ? 0
        : ((userCount * totalModules) / totalAnswersForDepartment) * 100;

    return {
      department,
      count: percentage,
    };
  });

  return completionPercentages;
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
  ] = await Promise.all([
    handleUserScores(),
    getSevenDaysInactiveUsersCount(),
    getFifteenDaysInactiveUsersCount(),
    getUserCountForEachDepartment(),
    getTotalModules(),
    calculateModulesCompletedPercentage(),
  ]);

  return res.json({
    userScores,
    sevenDaysInactiveUsers,
    fifteenDaysInactiveUsers,
    userCountofDepartment,
    getTotalDepartmentModules,
    modulesCompleted,
  });
};
