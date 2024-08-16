import { Request, Response } from "express";
import DailyQuestion from "../models/dailyQuestion.model";
import User from "../models/user.model";

export const getDailyQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const { userId } = req.body;

    const dailyQuestion = await DailyQuestion.findOne({ date: today });
    if (!dailyQuestion) {
      res.status(404).json({ message: "No daily question found for today" });
      return;
    }

    const user = await User.findById(userId).select("dailyQuestionResponse");
    const userResponse = user?.dailyQuestionResponse;

    const stats = {
      Sales: dailyQuestion.departmentResponses.Sales,
      Credit: dailyQuestion.departmentResponses.Credit,
      Collection: dailyQuestion.departmentResponses.Collection,
      Other: dailyQuestion.departmentResponses.Other,
    };
    const response = {
      question: dailyQuestion.questionPrompt,
      options: {
        OptionA: "Option A ",
        OptionB: "Option B ",
      },
      userResponse: userResponse,
      stats,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
