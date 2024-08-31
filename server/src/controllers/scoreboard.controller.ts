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
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const users = await User.find({})
      .select("_id score name")
      .sort({ score: -1 })
      .limit(10);

    const scoreboard = [];
    let rank = 1;

    for (const user of users) {
      const totalEngagedTimeOfUser = await calculateTotalEngagedTime(user._id.toString());

      scoreboard.push({
        rank: rank,
        name: user.name,
        timeInMints: totalEngagedTimeOfUser,
        points: user.score,
      });
      rank++;
    }

    const { _id: userId } = req.user;
    const currentUserScore = await User.findOne({ _id: userId }).select(
      "name score"
    );

    if (!currentUserScore) {
      return next(new AppError("Current user not found", 404));
    }

    const totalEngagedTimeOfCurrentUser = await calculateTotalEngagedTime(
      userId.toString()
    );

    const userRanks = await User.find({})
      .select("_id score")
      .sort({ score: -1 });

    let currentUserRank = userRanks.findIndex(
      (user) => user._id.toString() === userId.toString()
    ) + 1;

    const currentUserDetails = {
      rank: currentUserRank,
      name: "You",
      timeInMints: totalEngagedTimeOfCurrentUser,
      points: currentUserScore.score,
    };

    res.status(200).json({ scoreboard, currentUserDetails });
  } catch (error) {
    next(error);
  }
};

const calculateTotalEngagedTime = async (userId: string) => {
  const weeklyResponses = await WeeklyResponse.find({ user: userId });

  if (!weeklyResponses || weeklyResponses.length === 0) {
    return 0; 
  }

  return weeklyResponses.reduce((totalTime, weeklyResponse) => {
    const startDate = new Date(weeklyResponse.startTime);
    const endDate = new Date(weeklyResponse.endTime);

    const timeDifferenceInMinutes =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    return totalTime + timeDifferenceInMinutes;
  }, 0);
};
