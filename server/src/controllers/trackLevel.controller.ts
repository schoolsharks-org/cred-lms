import mongoose from 'mongoose';
import { NextFunction, Request, Response } from "express";
import AppError from '../utils/appError';
import WeeklyResponse from '../models/weeklyResponse.model';
import WeeklyQuestion from '../models/weeklyQuestion.model';

interface WeeklyStatus {
  week: string;
  status: 'TO_BE_LAUNCHED' | 'IN_PROGRESS' | 'COMPLETED';
  date: string;
}

interface MonthStatus {
  month: string;
  year: number;
  weeks: WeeklyStatus[];
}

function getMondaysOfMonth(year: number, month: number): Date[] {
  const mondays: Date[] = [];
  const date = new Date(Date.UTC(year, month - 1, 1));
  while (date.getUTCMonth() === month - 1) {
    if (date.getUTCDay() === 1) {
      mondays.push(new Date(date));
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return mondays.reverse(); 
}

function getMonthName(monthIndex: number): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthIndex];
}

async function fetchStatusForWeeks(userId: string): Promise<MonthStatus> {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth() + 1; // JS month is 0-indexed
  const mondays = getMondaysOfMonth(year, month);
  
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const endOfMonth = new Date(Date.UTC(year, month, 0));

  const weeklyQuestions = await WeeklyQuestion.find({
    date: { $gte: startOfMonth, $lt: endOfMonth },
  });

  const weeklyQuestionsMap = new Map(weeklyQuestions.map(q => [q.date.toISOString().split('T')[0], q]));

  const results: WeeklyStatus[] = await Promise.all(mondays.map(async (monday, index) => {
    const weekNumber = mondays.length - index;
    const weekLabel = `week-${weekNumber}`;
    let status: 'TO_BE_LAUNCHED' | 'IN_PROGRESS' | 'COMPLETED' = 'TO_BE_LAUNCHED';
    const mondayString = monday.toISOString().split('T')[0];

    if (weeklyQuestionsMap.has(mondayString)) {
      const questionId = weeklyQuestionsMap.get(mondayString)!._id;
      const weeklyResponse = await WeeklyResponse.findOne({
        user: new mongoose.Types.ObjectId(userId),
        question: questionId,
      });
      status = weeklyResponse ? 'COMPLETED' : 'IN_PROGRESS';
    }

    return {
      week: weekLabel,
      status,
      date: mondayString,
    };
  }));

  return {
    month: getMonthName(month - 1),
    year: year,
    weeks: results,
  };
}

export const handleTrackLevels = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  try {
    const { _id: userId } = req.user;
    const monthStatus = await fetchStatusForWeeks(userId.toString());
    res.json({ monthly_status: [monthStatus] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};