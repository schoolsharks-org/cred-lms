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

async function fetchStatusForMonth(userId: string, year: number, month: number): Promise<MonthStatus | null> {
  console.log(`Fetching status for ${year}-${month}`);
  const mondays = getMondaysOfMonth(year, month);
  
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const weeklyQuestions = await WeeklyQuestion.find({
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  console.log(`Found ${weeklyQuestions.length} weekly questions for ${year}-${month}`);

  if (weeklyQuestions.length === 0) {
    return null;
  }

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
        weeklyQuestion: questionId,
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

async function fetchAllMonthsStatus(userId: string): Promise<MonthStatus[]> {
  const today = new Date();
  const currentYear = today.getUTCFullYear();
  const currentMonth = today.getUTCMonth() + 1;

  const startDate = new Date(Date.UTC(2024, 8, 1)); // September 2024
  const monthsToFetch: Array<[number, number]> = [];

  for (let year = currentYear; year >= 2024; year--) {
    const startMonth = year === currentYear ? currentMonth : 12;
    const endMonth = year === 2024 ? 9 : 1;

    for (let month = startMonth; month >= endMonth; month--) {
      const currentDate = new Date(Date.UTC(year, month - 1, 1));
      if (currentDate >= startDate && currentDate <= today) {
        monthsToFetch.push([year, month]);
      }
    }
  }

  console.log('Months to fetch:', monthsToFetch);

  const allMonthsStatus = await Promise.all(
    monthsToFetch.map(([year, month]) => fetchStatusForMonth(userId, year, month))
  );

  return allMonthsStatus.filter((status): status is MonthStatus => status !== null);
}

export const handleTrackLevels = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  try {
    const { _id: userId } = req.user;
    console.log('Fetching track levels for user:', userId);
    const allMonthsStatus = await fetchAllMonthsStatus(userId.toString());
    console.log(`Found status for ${allMonthsStatus.length} months`);
    res.json({ monthly_status: allMonthsStatus });
  } catch (err) {
    console.error('Error in handleTrackLevels:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}