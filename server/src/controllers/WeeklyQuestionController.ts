import { NextFunction, Request, Response } from "express";
import WeeklyQuestion from "../models/weeklyQuestion.model";
import WeeklyResponse from "../models/weeklyResponse.model";
import AppError from "../utils/appError";

function getMondayOfCurrentWeek(date: Date): Date {
  const dayOfWeek = date.getUTCDay();
  const difference = (dayOfWeek + 6) % 7;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - difference);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

export const getWeeklyQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const { date } = req.query;

  const TodayDate = new Date(date as string);
  const startOfWeek = getMondayOfCurrentWeek(TodayDate);

  const weeklyQuestionModule = await WeeklyQuestion.find({ date: startOfWeek });
  const currentTime = new Date().toISOString();
  if (!weeklyQuestionModule) {
    res.status(404).json({ message: "No weekly question found for this week" });
    return;
  }
  res.status(200).json({ weeklyQuestionModule, currentTime });
};

export const respondToWeeklyQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(new AppError("UnAuthorized", 401));
      return;
    }
    const { questionId, response } = req.body;
    const date = req.params;
    const userId = req.user;

    const existingUserResponse = WeeklyResponse.findOne({
      user: userId,
      date: date,
    });

    const alreadyRespondedQuestion = WeeklyResponse.findOne({
      user: userId,
      date: date,
      weeklyresponses: [
        {
          _id: questionId,
        },
      ],
    });

    if (!existingUserResponse) {
      const NewUserResponse = new WeeklyResponse({
        date: new Date(),
        user: userId,
        userResponse: {
          id: questionId,
          response: response,
        },
      });
      await NewUserResponse.save();

      res.json("Response");
    }

    if (!alreadyRespondedQuestion) {
      const updateResponse = await WeeklyResponse.updateOne({
        date: new Date(),
        user: userId,
        $push: {
          userResponse: {
            _id: questionId,
            response: response,
          },
        },
      });
      res.json({ message: "Response stored" });
    }

    res.json({ message: "This question is already responded" });
  } catch (error) {
    res.json(error);
  }
};
