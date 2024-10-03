import { NextFunction, Request, Response } from "express";
import WeeklyQuestion from "../models/weeklyQuestion.model";
import WeeklyResponse, { MAX_REATTEMPTS } from "../models/weeklyResponse.model";
import AppError from "../utils/appError";
import User from "../models/user.model";

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

  const { _id: userId, department } = req.user;
  const { date } = req.query;

  const TodayDate = new Date(date as string);
  const startOfWeek = getMondayOfCurrentWeek(TodayDate);

  const weeklyQuestions = await WeeklyQuestion.findOne({
    date: startOfWeek,
    department,
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

  if (userResponse.reattempts.length > 0) {
    answeredCount =
      userResponse.reattempts[userResponse.reattempts.length - 1].answeredCount;
  }

  const maxScore = weeklyQuestions.weeklyQuestionModule.reduce(
    (a, b) => a + b.score,
    0
  );
  const totalScore = Object.values(weeklyQuestions.toObject().analytics)
    .filter((item) => typeof item.totalScore === "number")
    .reduce((a, b) => a + b.totalScore, 0);
  const totalAnswers = Object.values(weeklyQuestions.toObject().analytics)
    .filter((item) => typeof item.totalScore === "number")
    .reduce((a, b) => a + b.totalAnswers, 0);

  res.status(200).json({
    id: weeklyQuestions._id,
    questions: weeklyQuestions.weeklyQuestionModule,
    moduleName: weeklyQuestions.moduleName,
    startTime: userResponse.startTime,
    answeredCount,
    scores:
      answeredCount === weeklyQuestions.weeklyQuestionModule.length
        ? {
            userScore: userResponse.score,
            maxScore: maxScore,
            averageScore: totalScore / totalAnswers,
            reattemptScores: userResponse.reattempts.map((item) => item.score),
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
  const { _id: userId, department: userDepartment } = req.user;

  const today = new Date();
  const startOfWeek = getMondayOfCurrentWeek(today);

  const weeklyQuestions = await WeeklyQuestion.findOne({
    date: startOfWeek,
    department: userDepartment,
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
      reattempts: [],
    });
  }

  const maxScore = weeklyQuestions.weeklyQuestionModule.reduce(
    (a, b) => a + b.score,
    0
  );
  const totalScore = Object.values(weeklyQuestions.toObject().analytics)
    .filter((item) => typeof item.totalScore === "number")
    .reduce((a, b) => a + b.totalScore, 0);
  const totalAnswers = Object.values(weeklyQuestions.toObject().analytics)
    .filter((item) => typeof item.totalAnswers === "number")
    .reduce((a, b) => a + b.totalAnswers, 0);

  if (existingUserResponse.reattempts?.length > 0) {
    const lastReattempt =
      existingUserResponse.reattempts[
        existingUserResponse.reattempts.length - 1
      ];

    if (response === question.correctOption) {
      lastReattempt.score += question.score;
    }

    lastReattempt.answeredCount = (lastReattempt.answeredCount || 0) + 1;

    if (
      lastReattempt.answeredCount >=
        weeklyQuestions.weeklyQuestionModule.length &&
      lastReattempt.score > 0.8 * maxScore
    ) {
      await WeeklyQuestion.findByIdAndUpdate(weeklyQuestions._id, {
        $inc: {
          [`analytics.${userDepartment}.progressReattempt`]: 1,
        },
      });
    }
    await existingUserResponse.save();

    return res.status(200).json({
      correctAnswer: question.correctOption,
      answeredCount: lastReattempt.answeredCount,
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
    const endTime = new Date();

    await WeeklyQuestion.findByIdAndUpdate(weeklyQuestions._id, {
      $inc: {
        [`analytics.${userDepartment}.totalScore`]: existingUserResponse.score,
        [`analytics.${userDepartment}.totalAnswers`]: 1,
        [`analytics.${userDepartment}.totalTime`]:
          (endTime.getTime() - existingUserResponse.startTime.getTime()) / 1000,
        [`analytics.${userDepartment}.belowEighty`]:
          existingUserResponse.score < 0.8 * maxScore ? 1 : 0,
      },
    });

    if (!existingUserResponse.endTime) {
      existingUserResponse.endTime = endTime;
      await existingUserResponse.save();
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { score: existingUserResponse.score },
    });
  }

  const answeringLastQuestion =
    existingUserResponse.userResponse.length ===
    weeklyQuestions.weeklyQuestionModule.length;

  res.status(200).json({
    message: "Response stored successfully",
    correctAnswer: question.correctOption,
    answeredCount: existingUserResponse.userResponse.length,
    scores: answeringLastQuestion
      ? {
          userScore: existingUserResponse.score,
          maxScore: maxScore,
          reattempts: existingUserResponse.reattempts,
          averageScore: totalScore / totalAnswers,
        }
      : undefined,
  });
};



export const handleReattemptRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const { weeklyQuestion } = req.body;
  const { _id: userId, department } = req.user;

  const weeklyResponse = await WeeklyResponse.findOne({
    weeklyQuestion: weeklyQuestion,
    user: userId,
  });

  const weeklyQuestions = await WeeklyQuestion.findOne({
    _id: weeklyQuestion,
  });

  if (!weeklyResponse || !weeklyQuestions) {
    return next(new AppError("Invalid weekly question", 400));
  }

  if ((weeklyResponse?.reattempts || []).length >= MAX_REATTEMPTS) {
    return next(new AppError("Maximum reattempts exceeded", 400));
  }

  if (weeklyResponse?.reattempts.length === 0) {
    await WeeklyQuestion.findByIdAndUpdate(weeklyQuestions._id, {
      $inc: {
        [`analytics.${department}.reattempted`]: 1,
      },
    });
  }
  // const maxScore=weeklyQuestions.weeklyQuestionModule.reduce((a,b)=>a+b.score,0)

  // if(weeklyResponse?.score/maxScore >= 0.8){
  //   return next(new AppError("Your score is already greater than 80%",400))
  // }

  weeklyResponse?.reattempts.push({ score: 0, answeredCount: 0 });
  weeklyResponse?.save();

  return res.status(200).json({
    message: `Reattempt ${weeklyResponse?.reattempts.length} requested successfully!`,
  });
};

export const fetchWeeklyQuestionInsights = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const { department } = req.user;

  const today = new Date();
  const startOfWeek = getMondayOfCurrentWeek(today);

  const data = await WeeklyQuestion.findOne({
    date: startOfWeek,
    department,
  }).select("insights moduleName");

  if (!data) {
    return next(new AppError("No Weekly Module found", 404));
  }

  res
    .status(200)
    .json({ insights: data?.insights, moduleName: data?.moduleName });
};

export const handleFetchWeeklyQuestionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const { _id: userId, department } = req.user;

  const today = new Date();
  const startOfWeek = getMondayOfCurrentWeek(today);

  const weeklyQuestion = await WeeklyQuestion.findOne({
    date: startOfWeek,
    department,
  });

  if (!weeklyQuestion) {
    return next(new AppError("No Weekly Question Found", 404));
  }

  return res
    .status(200)
    .json({ moduleName: weeklyQuestion.moduleName, date: weeklyQuestion.date });
};


