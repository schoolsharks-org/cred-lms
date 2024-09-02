import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import DailyQuestion from "../models/dailyQuestion.model";
import User from "../models/user.model";

export const employeeDailyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { month, week } = req.body;
  if (!month || !week) {
    return res.status(400).json({ message: "Month and week are required." });
  }

  //   const monthNumber = parseInt(month as string, 10);
  //   const weekNumber = parseInt(week as string, 10);

  //   if (
  //     isNaN(monthNumber) ||
  //     isNaN(weekNumber) ||
  //     monthNumber < 1 ||
  //     monthNumber > 12
  //   ) {
  //     return res.status(400).json({ message: "Invalid month or year." });
  //   }

  function getMondays(year: number, month: number) {
    const mondays = [];
    const firstDay = new Date(year, month - 1, 1); // Adjust month since JavaScript uses 0-based month indexing
    const dayOfWeek = firstDay.getDay();

    // Determine the first Monday of the month
    const firstMonday =
      dayOfWeek === 1
        ? firstDay
        : new Date(year, month - 1, 1 + ((8 - dayOfWeek) % 7));

    let currentMonday = new Date(firstMonday);
    while (currentMonday.getMonth() === month - 1) {
      mondays.push(new Date(currentMonday));
      currentMonday.setDate(currentMonday.getDate() + 7);
    }

    return mondays;
  }
  const year = new Date().getFullYear(); // Use the current year or adjust as needed
  const mondays = getMondays(year, Number(month));
  const startOfWeek = mondays[Number(week) - 1];
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // Sunday of the week
  console.log("endOfWeek: ", endOfWeek);
  const dailyQuestions = await DailyQuestion.find({
    date: { $gte: startOfWeek, $lte: endOfWeek },
  });

  if (dailyQuestions.length === 0) {
    return next(
      new AppError("No daily questions found for the selected week", 400)
    );
  }
  console.log("dailyQuestions: ", dailyQuestions);
  // Process statistics for each day in the week
  const percentagesByDay = [];
  let totalResponses = 0;

  for (const dailyQuestion of dailyQuestions) {
    const departmentResponse = dailyQuestion.departmentResponses;
    const percentages: Record<string, { OptionA: string; OptionB: string }> =
      {};
    let usersNotVoted = 0;
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
          OptionA: `${optionAPercentage}%`,
          OptionB: `${optionBPercentage}%`,
        };
      } else {
        percentages[department] = {
          OptionA: "0%",
          OptionB: "0%",
        };
      }
    }

    // Calculate the total responses for this day
    for (const responses of Object.values(departmentResponse)) {
      totalResponses += responses.OptionA + responses.OptionB;
    }

    const usersCount = await User.countDocuments();
    usersNotVoted = usersCount - totalResponses;

    percentagesByDay.push({
      date: dailyQuestion.date,
      question: dailyQuestion.questionPrompt,
      stats: percentages,
      Voted: totalResponses,
      NotVoted: usersNotVoted,
    });
  }

  res.status(200).json(percentagesByDay);
};
