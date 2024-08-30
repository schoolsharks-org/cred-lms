import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import WeeklyResponse from "../models/weeklyResponse.model";
import WeeklyQuestion from "../models/weeklyQuestion.model";

function getMondays(year: any, month: any) {
  const mondays = [];

  const firstDay = new Date(year, month, 1);
  console.log("firstDay: ", firstDay);
  const dayOfWeek = firstDay.getDay();
  console.log("dayOfWeek: ", dayOfWeek);
  let firstMonday;
  if (dayOfWeek === 0) {
    firstMonday = new Date(year, month, 2);
    console.log("firstMonday: ", firstMonday);
  } else {
    const daysToAdd = dayOfWeek === 1 ? 0 : 9 - dayOfWeek;
    firstMonday = new Date(year, month, 1 + daysToAdd);
    console.log("firstMonday: ", firstMonday);
  }

  console.log("firstMonday: ", firstMonday);
  let currentMonday = firstMonday;
  while (currentMonday.getMonth() === month) {
    mondays.push(new Date(currentMonday));

    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  console.log("modays: ", mondays);
  const formattedMondays = mondays.map(
    (date) => date.toISOString().split("T")[0]
  );
  console.log("formattedMondays: ", formattedMondays);
  return formattedMondays;
}

export const TrackLevels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const { _id: userId, department } = req.user;
  const year = 2024;
  const month = 7;
  const trackLevel = [];
  const mondays = getMondays(year, month);
  let weekNumber = 1;
  //   let moduleCompleted = true;
  for (const monday of mondays) {
    const weeklyQuestion = await WeeklyQuestion.findOne({
      date: monday,
      department: department,
    });
    if (!weeklyQuestion) {
      new AppError("No Weekly Module Found", 404);
      continue;
    }

    const weeklyResponses = await WeeklyResponse.find({
      weeklyQuestion: weeklyQuestion._id,
      user: userId,
    });

    if (weeklyResponses.length === 0) {
      trackLevel.push({
        week: weekNumber,
        moduleCompletionStatus: false,
      });
      weekNumber += 1;
    } else {
      trackLevel.push({
        week: weekNumber,
        moduleCompletionStatus: true,
      });
      weekNumber += 1;
    }
  }

  res.status(200).json({ TrackLevels: trackLevel });
};
