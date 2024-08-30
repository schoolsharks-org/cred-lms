import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import WeeklyResponse from "../models/weeklyResponse.model";
import User from "../models/user.model";

export const handleScoreboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const users = await User.find({}).select("_id");

  const scoreboard = [];

  for (const user of users) {
    const weeklyResponses = await WeeklyResponse.find({ user: user._id });

    if (!weeklyResponses) {
      return next(new AppError("There are no responses from this user", 400));
    }
    let scoreTotal = 0;
    const totalTimeEngaged = [];
    for (const weeklyResponse of weeklyResponses) {
      const startDate = new Date(weeklyResponse.startTime);
      const endDate = new Date(weeklyResponse.endTime);

      const timeDifferenceInMilliseconds: number =
        endDate.getTime() - startDate.getTime();

      const timeDifferenceInMinutes: number =
        timeDifferenceInMilliseconds / (1000 * 60);

      totalTimeEngaged.push(timeDifferenceInMinutes);

      scoreTotal += weeklyResponse.score;
    }

    const totalEngagedTimeOfUser = totalTimeEngaged.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const response = [
      {
        userName: user.name,
        user: user._id,
        time: totalEngagedTimeOfUser,
        points: scoreTotal,
      },
    ];

    scoreboard.push(response);
  }

  res.status(200).json({ scoreboard });
};
