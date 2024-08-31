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

  const users = await User.find({})
    .select("_id score name")
    .sort({ score: -1 })
    .limit(10);

  const scoreboard = [];
  let rank = 1;
  for (const user of users) {
    const weeklyResponses = await WeeklyResponse.find({ user: user._id });

    if (!weeklyResponses) {
      return next(new AppError("There are no responses from this user", 400));
    }

    const totalTimeEngaged = [];
    for (const weeklyResponse of weeklyResponses) {
      const startDate = new Date(weeklyResponse.startTime);
      const endDate = new Date(weeklyResponse.endTime);

      const timeDifferenceInMilliseconds: number =
        endDate.getTime() - startDate.getTime();

      const timeDifferenceInMinutes: number =
        timeDifferenceInMilliseconds / (1000 * 60);

      totalTimeEngaged.push(timeDifferenceInMinutes);
    }

    const totalEngagedTimeOfUser = totalTimeEngaged.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const response = [
      {
        rank: rank,
        name: user.name,
        timeInMints: totalEngagedTimeOfUser,
        points: user.score,
      },
    ];

    scoreboard.push(response);
    rank += 1;
  }

  const { _id: userId } = req.user;
  const currentUserScore = await User.findOne({ _id: userId }).select(
    "name score"
  );

  if (!currentUserScore) {
    scoreboard.push({
      user: userId,
      name: req.user.name,
      score: 0,
    });
    return;
  }
  const weeklyResponses = await WeeklyResponse.find({ user: userId });

  if (!weeklyResponses) {
  }

  const totalUserTime = [];
  for (const weeklyResponse of weeklyResponses) {
    const startDate = new Date(weeklyResponse.startTime);
    const endDate = new Date(weeklyResponse.endTime);

    const timeDifferenceInMilliseconds: number =
      endDate.getTime() - startDate.getTime();

    const timeDifferenceInMinutes: number =
      timeDifferenceInMilliseconds / (1000 * 60);

    totalUserTime.push(timeDifferenceInMinutes);
  }

  const totalEngagedTimeOfCurrentUser = totalUserTime.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  let currentUserRank = -1;
  const userRanks = await User.find({})
    .select("_id score name")
    .sort({ score: -1 });

  for (const userRank of userRanks) {
    if (userRank._id == userId) {
      currentUserRank = 1;
    }
    currentUserRank += 1;
  }

  console.log("currentUserRank: ", currentUserRank);

  const currentUserDetails = {
    rank: currentUserRank,
    name: "You",
    timeInMints: totalEngagedTimeOfCurrentUser,
    score: currentUserScore?.score,
  };

  res.status(200).json({ scoreboard, currentUserDetails });
};
