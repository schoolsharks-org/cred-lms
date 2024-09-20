import { NextFunction, Request, Response } from "express";
import DailyUpdate from "../models/dailyUpdate.model";
import AppError from "../utils/appError";

export const fetchHelpSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fetchUpdates = await DailyUpdate.find({}).select("title image");

  return res.json(fetchUpdates);
};

export const fetchModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id: moduleId } = req.query;

  const modules = await DailyUpdate.findOne({ _id: moduleId }).select("module title");

  if(!modules){
    return next(new AppError("Invalid module",400))
  }
  

  return res.json({title:modules.title,modules:modules.module});
};
