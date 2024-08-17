import { Request, Response } from "express";
import DailyQuestion from "../models/dailyQuestion.model";
import User from "../models/user.model";

export const getDailyQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const dailyQuestion = await DailyQuestion.findOne({
      date: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    });

    if (!dailyQuestion) {
      res.status(404).json({ message: "No daily question found for today" });
      return;
    }
    const { userId } = req.body;
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
        OptionA: "Option A",
        OptionB: "Option B",
      },
      userResponse: userResponse,
      stats,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
