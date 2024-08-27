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
export const handleAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const TodayDate = new Date();
  const startOfWeek = getMondayOfCurrentWeek(TodayDate);
  const endOfWeek = getSundayOfCurrentWeek(TodayDate);

  const weeklyQuestions = await WeeklyQuestion.findOne({
    date: startOfWeek,
  });

  const usersCurrentWeekResponses = await WeeklyResponse.find({
    startTime: { $gte: startOfWeek, $lte: endOfWeek },
  })
    .sort({ score: -1 })
    .select("score user");

  const TopScorers = [];
  if (weeklyQuestions) {
    for (const response of usersCurrentWeekResponses) {
      const user = await User.findOne({ _id: response.user }).select("name");

      if (user) {
        TopScorers.push({
          Name: user.name,
          Score: (response.score * 100) / weeklyQuestions.totalScore,
        });
      }
    }
  }

  res.json({
    TopScorers,
  });
};
