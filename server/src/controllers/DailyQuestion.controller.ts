import moment from 'moment-timezone';
import { NextFunction, Request, Response } from "express";
import DailyQuestion, { Option } from "../models/dailyQuestion.model";
import DailyResponse from "../models/dailyResponse.model";
import AppError from "../utils/appError";
import User from '../models/user.model';


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
    const { _id: userId,department } = req.user;
    

    const requestedDate = moment.tz(date as string, "DD/MM/YYYY, hh:mm:ss A", "Asia/Kolkata");
    const startOfDay = requestedDate.clone().startOf('day').toDate();
    const endOfDay = requestedDate.clone().endOf('day').toDate();


    let dailyQuestion = await DailyQuestion.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
      department:department
    });

    if (!dailyQuestion) {
      res.status(404).json({ message: `No daily question found for the date ${date}` });
      return;
    }

    const userResponse = await DailyResponse.findOne({
      user: userId,
      dailyQuestion: dailyQuestion._id,
    });
    
    const peopleResponded = Object.values(dailyQuestion.departmentResponses).reduce(
      (a, b) => a + b.OptionA+b.OptionB, 
      0 
    );

    const response = {
      question: dailyQuestion.questionPrompt,
      options: {
        OptionA: dailyQuestion.options.optionA,
        OptionB: dailyQuestion.options.optionB,
      },
      optionTexts:dailyQuestion.optionTexts,
      peopleResponded,
      userResponse: userResponse ? userResponse.userResponse : "Not Answered",
      correctOption:userResponse ? dailyQuestion.correctOption : "Not Answered",
      stats: userResponse ? {
        Sales: dailyQuestion.departmentResponses.Sales,
        Credit: dailyQuestion.departmentResponses.Credit,
        Collection: dailyQuestion.departmentResponses.Collection,
        Operations:dailyQuestion.departmentResponses.Operations,
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

    const { _id: userId,department, score } = req.user;

    if (option !== "OptionA" && option !== "OptionB") {
      res.status(400).json({ message: "Invalid option." });
      return;
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailyQuestion = await DailyQuestion.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
      department:department
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
        score:score,
        options: {
          OptionA: dailyQuestion.options.optionA,
          OptionB: dailyQuestion.options.optionB,
        },
        userResponse: existingResponse.userResponse,
        correctOption:dailyQuestion.correctOption,
        stats: {
          Sales: dailyQuestion.departmentResponses.Sales,
          Credit: dailyQuestion.departmentResponses.Credit,
          Collection: dailyQuestion.departmentResponses.Collection,
          Operations:dailyQuestion.departmentResponses.Operations,
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

    await User.findByIdAndUpdate(
      userId,
      { $inc: { score: 5 } },
    )

    if (department && dailyQuestion.departmentResponses[department]) {
      dailyQuestion.departmentResponses[department][option] += 1;
    }

    await dailyQuestion.save();

    const response = {
      question: dailyQuestion.questionPrompt,
      userResponse: userResponse.userResponse,
      options: {
        OptionA: dailyQuestion.options.optionA,
        OptionB: dailyQuestion.options.optionB,
      },
      correctOption:dailyQuestion.correctOption,
      stats: {
        Sales: dailyQuestion.departmentResponses.Sales,
        Credit: dailyQuestion.departmentResponses.Credit,
        Collection: dailyQuestion.departmentResponses.Collection,
        Operations:dailyQuestion.departmentResponses.Operations,
        Others: dailyQuestion.departmentResponses.Others,
      },
      score:score+5
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};