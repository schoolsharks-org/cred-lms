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
  const { _id: userId } = req.user;
  const { date } = req.query;

  console.log("Date:", date);
  const TodayDate = new Date(date as string);
  const startOfWeek = getMondayOfCurrentWeek(TodayDate);

  const weeklyQuestions = await WeeklyQuestion.findOne({
    date: startOfWeek,
  });

  if (!weeklyQuestions) {
    return next(new AppError("No weekly questions found for this week", 404));
  }

  const existingUserResponse = await WeeklyResponse.findOne({
    weeklyQuestion: weeklyQuestions._id,
    user: userId,
  });

  let answeredCount = 0;
  let userResponse;

  if (existingUserResponse) {
    answeredCount = existingUserResponse.userResponse.length;
    userResponse = existingUserResponse;
  } else {
    const currentTime = new Date();
    userResponse = new WeeklyResponse({
      weeklyQuestion: weeklyQuestions._id,
      userResponse: [],
      user: userId,
      startTime: currentTime,
    });
    userResponse.save();
  }

  res.status(200).json({
    questions: weeklyQuestions.weeklyQuestionModule,
    startTime: userResponse.startTime,
    answeredCount,
    scores:
      answeredCount === weeklyQuestions.weeklyQuestionModule.length
        ? {
            userScore: userResponse.score,
            averageScore:
              weeklyQuestions.totalScore / weeklyQuestions.totalAnswers,
          }
        : undefined,
  });
};

export const respondToWeeklyQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const { questionId, response } = req.body;
  const userId = req.user._id;

  const today = new Date();
  const startOfWeek = getMondayOfCurrentWeek(today);

  const weeklyQuestions = await WeeklyQuestion.findOne({
    date: startOfWeek,
  });

  if (!weeklyQuestions) {
    return next(new AppError("No weekly questions found for this week", 404));
  }

  const question = weeklyQuestions.weeklyQuestionModule.find(
    (element) => element.id.toString() === questionId.toString()
  );

  if (!question) {
    return next(new AppError("Invalid question ID", 400));
  }

  let existingUserResponse = await WeeklyResponse.findOne({
    user: userId,
    weeklyQuestion: weeklyQuestions._id,
  });

  if (!existingUserResponse) {
    existingUserResponse = new WeeklyResponse({
      user: userId,
      weeklyQuestion: weeklyQuestions._id,
      startTime: new Date(),
      userResponse: [],
    });
  }

  const alreadyResponded = existingUserResponse.userResponse.find(
    (response) => response._id.toString() === questionId
  );

  if (alreadyResponded) {
    return res.status(200).json({
      message: "This question has already been responded",
      correctAnswer: question.correctOption,
      answeredCount: existingUserResponse.userResponse.length,
    });
  }

  if (response === question.correctOption) {
    existingUserResponse.score += question.score;
  }

  existingUserResponse.userResponse.push({
    _id: questionId,
    response: response,
  });

  await existingUserResponse.save();

  if (
    existingUserResponse.userResponse.length ===
    weeklyQuestions.weeklyQuestionModule.length
  ) {
    weeklyQuestions.totalAnswers += 1;
    weeklyQuestions.totalScore += existingUserResponse.score;
    console.log(weeklyQuestions.totalAnswers);

    await weeklyQuestions.save();
  }

  res.status(200).json({
    message: "Response stored successfully",
    correctAnswer: question.correctOption,
    answeredCount: existingUserResponse.userResponse.length,
    scores:
      existingUserResponse.userResponse.length ===
      weeklyQuestions.weeklyQuestionModule.length
        ? {
            userScore: existingUserResponse.score,
            averageScore:
              weeklyQuestions.totalScore / weeklyQuestions.totalAnswers,
          }
        : undefined,
  });
};
