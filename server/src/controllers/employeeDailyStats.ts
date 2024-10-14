import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import DailyQuestion from "../models/dailyQuestion.model";
import User from "../models/user.model";

export const employeeDailyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { month, week } = req.query;

  if (!month || !week) {
    return res.status(400).json({ message: "Month and week are required." });
  }

  const monthNumber = parseInt(month as string, 10);
  const weekNumber = parseInt(week as string, 10);

  if (
    isNaN(monthNumber) ||
    isNaN(weekNumber) ||
    monthNumber < 1 ||
    monthNumber > 12 ||
    weekNumber < 1 ||
    weekNumber > 4
  ) {
    return res.status(400).json({ message: "Invalid month or week." });
  }

  const year = new Date().getFullYear(); // Use the current year or adjust as needed
  let startOfWeek: Date;
  let endOfWeek: Date;

  // Define the start and end dates based on the week number
  if (weekNumber === 1) {
    startOfWeek = new Date(year, monthNumber - 1, 1);
    endOfWeek = new Date(year, monthNumber - 1, 8);
  } else if (weekNumber === 2) {
    startOfWeek = new Date(year, monthNumber - 1, 8);
    endOfWeek = new Date(year, monthNumber - 1, 15);
  } else if (weekNumber === 3) {
    startOfWeek = new Date(year, monthNumber - 1, 15);
    endOfWeek = new Date(year, monthNumber - 1, 22);
  } else {
    startOfWeek = new Date(year, monthNumber - 1, 22);
    endOfWeek = new Date(year, monthNumber, 0); // Last day of the month
  }

  endOfWeek.setDate(endOfWeek.getDate());
  endOfWeek.setHours(23, 59, 59, 999);

  const dailyQuestions = await DailyQuestion.find({
    date: { $gte: startOfWeek, $lte: endOfWeek },
  });
  
  if (dailyQuestions.length === 0) {
    return next(
      new AppError("No daily questions found for the selected week", 400)
    );
  }
  
  const usersCount = await User.countDocuments();
  
  const percentagesByDay = [];
  
  for (const dailyQuestion of dailyQuestions) {
    const departmentResponse = dailyQuestion.departmentResponses;
    const percentages: Record<string, { OptionA: string; OptionB: string }> = {};
    let totalResponses = 0;
  
    for (const [department, responses] of Object.entries(departmentResponse)) {
      const totalOptions = responses.OptionA + responses.OptionB;
  
      if (totalOptions > 0) {
        const optionAPercentage = (
          (responses.OptionA / totalOptions) *
          100
        ).toFixed(0);
        const optionBPercentage = (
          (responses.OptionB / totalOptions) *
          100
        ).toFixed(0);
  
        percentages[department] = {
          OptionA: optionAPercentage,
          OptionB: optionBPercentage,
        };
      } else {
        percentages[department] = {
          OptionA: "0",
          OptionB: "0",
        };
      }
  
      totalResponses += totalOptions;
    }
  
    const usersNotVoted = usersCount - totalResponses;
  
    percentagesByDay.push({
      date: new Date(dailyQuestion.date)
        .toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
        })
        .replace(/ (\d)$/, " $1th"),
      question: dailyQuestion.questionPrompt,
      department:dailyQuestion.department,
      stats: percentages,
      Voted: totalResponses,
      NotVoted: usersNotVoted,
    });
  }
  
  res.status(200).json(percentagesByDay);
  
};
