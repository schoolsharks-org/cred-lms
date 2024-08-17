import { NextFunction, Request, Response } from "express";
import DailyQuestion, { Option } from "../models/dailyQuestion.model";
import DailyResponse from "../models/dailyResponse.model";
import AppError from "../utils/appError";


export const getDailyQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    const { date } = req.query;
    const { _id: userId } = req.user;

    const requestedDate = new Date(date as string);
    const startOfDay = new Date(requestedDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(requestedDate.setUTCHours(23, 59, 59, 999));

    let dailyQuestion = await DailyQuestion.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!dailyQuestion) {
      res.status(404).json({ message: `No daily question found for the date ${date}` });
      return;
    }

    const userResponse = await DailyResponse.findOne({
      user: userId,
      dailyQuestion: dailyQuestion._id,
    });

    const response = {
      question: dailyQuestion.questionPrompt,
      options: {
        OptionA: dailyQuestion.options.optionA,
        OptionB: dailyQuestion.options.optionB,
      },
      userResponse: userResponse ? userResponse.userResponse : "Not Answered",
      stats: userResponse ? {
        Sales: dailyQuestion.departmentResponses.Sales,
        Credit: dailyQuestion.departmentResponses.Credit,
        Collection: dailyQuestion.departmentResponses.Collection,
        Others: dailyQuestion.departmentResponses.Others,
      } : undefined,
    };

    res.status(200).json(response);

 
};


export const respondToDailyQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { option }: { option: Option } = req.body;

    if (!req.user) {
      next(new AppError("UnAuthorized", 401));
      return;
    }

    const { _id: userId, department } = req.user;

    if (option !== "OptionA" && option !== "OptionB") {
      res.status(400).json({ message: "Invalid option." });
      return;
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailyQuestion = await DailyQuestion.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!dailyQuestion) {
      res.status(404).json({ message: "No daily question found for today." });
      return;
    }

    const existingResponse = await DailyResponse.findOne({
      user: userId,
      dailyQuestion: dailyQuestion._id,
    });

    if (existingResponse) {
      const response = {
        question: dailyQuestion.questionPrompt,
        userResponse: existingResponse.userResponse,
        stats: {
          Sales: dailyQuestion.departmentResponses.Sales,
          Credit: dailyQuestion.departmentResponses.Credit,
          Collection: dailyQuestion.departmentResponses.Collection,
          Others: dailyQuestion.departmentResponses.Others,
        },
      };
      res.status(200).json(response);
      return;
    }

    const userResponse = new DailyResponse({
      date: new Date(),
      dailyQuestion: dailyQuestion._id,
      user: userId,
      userResponse: option,
    });

    await userResponse.save();

    if (department && dailyQuestion.departmentResponses[department]) {
      dailyQuestion.departmentResponses[department][option] += 1;
    }

    await dailyQuestion.save();

    const response = {
      question: dailyQuestion.questionPrompt,
      userResponse: userResponse.userResponse,
      stats: {
        Sales: dailyQuestion.departmentResponses.Sales,
        Credit: dailyQuestion.departmentResponses.Credit,
        Collection: dailyQuestion.departmentResponses.Collection,
        Others: dailyQuestion.departmentResponses.Others,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};