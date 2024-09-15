import { NextFunction, Request, Response } from "express";
import DailyUpdate from "../models/dailyUpdate.model";

export const fetchAllDailyUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fetchUpdates = await DailyUpdate.find({}).select("title image");

  return res.json({ DailyUpdates: fetchUpdates });
};

export const fetchModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id: moduleId } = req.body;

  const modules = await DailyUpdate.find({ _id: moduleId }).select("module");

  return res.json({ modules });
};
