import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import WeeklyResponse from "../models/weeklyResponse.model";
import User from "../models/user.model";
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
  })
    .sort({ score: -1 })
    .select("score user")
    .limit(10);

  const TopScorers = [];
  if (weeklyQuestions) {
    for (const response of userWeeklyTopScorers) {
      const user = await User.findOne({ _id: response.user }).select("name");

      if (user) {
        TopScorers.push({
          Name: user.name,
          Score: (response.score * 100) / weeklyQuestions.totalScore,
        });
      }
    }
  }

  const userWeeklyBelowAverageScorers = await WeeklyResponse.find({
    startTime: { $gte: startOfWeek, $lte: endOfWeek },
  })
    .sort({ score: 1 })
    .select("score user")
    .limit(5);

  const belowAvgScorers = [];
  if (weeklyQuestions) {
    for (const response of userWeeklyBelowAverageScorers) {
      const user = await User.findOne({ _id: response.user }).select("name");

      if (user) {
        belowAvgScorers.push({
          Name: user.name,
          Score: (response.score * 100) / weeklyQuestions.totalScore,
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

async function getUserCountForEachDepartment() {
  const departmentCounts = await User.aggregate([
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
  ]);

  return { userCount: departmentCounts };
}

export const handleAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    const [
      userScores,
      sevenDaysInactiveUsers,
      fifteenDaysInactiveUsers,
      userCountofDepartment,
    ] = await Promise.all([
      handleUserScores(),
      getSevenDaysInactiveUsersCount(),
      getFifteenDaysInactiveUsersCount(),
      getUserCountForEachDepartment(),
    ]);

    res.json({
      userScores,
      sevenDaysInactiveUsers,
      fifteenDaysInactiveUsers,
      userCountofDepartment,
    });
  } catch (error) {
    next(error);
  }
};
