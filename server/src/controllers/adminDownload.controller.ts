import { NextFunction, Request, Response } from "express";
import ExcelJS, { Workbook } from "exceljs";
import User from "../models/user.model";
import AppError from "../utils/appError";
import WeeklyQuestion from "../models/weeklyQuestion.model";
import WeeklyResponse from "../models/weeklyResponse.model";
import moment from "moment-timezone";
import path from "path";
import { log } from "console";
import { write } from "fs";

const exportToExcel = async (
  res: Response,
  data: any[],
  worksheetName: string,
  columns: Array<{ header: string; key: string; width: number }>
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(worksheetName);

  worksheet.columns = columns;

  data.forEach((item) => {
    const row: any = {};
    columns.forEach((col) => {
      const keys = col.key.split(".");
      let value = item;
      for (const key of keys) {
        value = value ? value[key] : null;
      }
      row[col.key] = value;
    });
    worksheet.addRow(row);
  });

  await workbook.xlsx.write(res);
  res.end();
};

const setDownloadHeaders = (res: Response, fileName: string) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}_${Date.now()}.xlsx`
  );
};

const handleUserExport = async (
  res: Response,
  next: NextFunction,
  getUsers: () => Promise<any[]>,
  worksheetName: string,
  fileName: string,
  columns: Array<{ header: string; key: string; width: number }>
) => {
  try {
    const users = await getUsers();

    if (!users || users.length === 0) {
      return next(new AppError("No users found", 404));
    }

    setDownloadHeaders(res, fileName);

    await exportToExcel(res, users, worksheetName, columns);
  } catch (error) {
    return next(new AppError("Failed to generate report", 500));
  }
};

async function getInactiveUsers(days: number) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  return User.aggregate([
    {
      $lookup: {
        from: "dailyresponses",
        localField: "_id",
        foreignField: "user",
        as: "responses",
      },
    },
    {
      $match: {
        "responses.date": { $not: { $gte: dateLimit } },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        department: 1,
        email: 1,
        contact: 1,
      },
    },
  ]);
}

export const handleTotalEmployeesDownload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Department", key: "department", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Contact", key: "contact", width: 15 },
    { header: "Score", key: "score", width: 10 },
  ];

  await handleUserExport(
    res,
    next,
    () => User.find({}, "name department email contact score"),
    "Employees",
    "employees",
    columns
  );
};

export const handleDownloadInactiveLast7Days = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Department", key: "department", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Contact", key: "contact", width: 15 },
  ];

  await handleUserExport(
    res,
    next,
    () => getInactiveUsers(7),
    "Inactive Last 7 Days",
    "inactive_users_last_7_days",
    columns
  );
};

export const handleDownloadInactiveLast15Days = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Department", key: "department", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Contact", key: "contact", width: 15 },
  ];

  await handleUserExport(
    res,
    next,
    () => getInactiveUsers(15),
    "Inactive Last 15 Days",
    "inactive_users_last_15_days",
    columns
  );
};

export const handleDownloadWeeklyModules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const weeklyQuestions = await WeeklyQuestion.aggregate([
      {
        $project: {
          _id: 0,
          moduleName: 1,
          department: 1,
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          noOfQuestions: { $size: "$weeklyQuestionModule" },
        },
      },
    ]);

    if (!weeklyQuestions || weeklyQuestions.length === 0) {
      return next(new AppError("No weekly questions found", 404));
    }

    const columns = [
      { header: "Module Name", key: "moduleName", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "No. of Questions", key: "noOfQuestions", width: 20 },
    ];

    setDownloadHeaders(res, "weekly_questions");

    await exportToExcel(res, weeklyQuestions, "Weekly Questions", columns);
  } catch (error) {
    return next(new AppError("Failed to export weekly modules", 500));
  }
};

export const handleDownloadModulesCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const modulesCompleted = await WeeklyResponse.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },

    {
      $group: {
        _id: "$user",
        name: { $first: "$userDetails.name" },
        department: { $first: "$userDetails.department" },
        modulesCompleted: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        department: 1,
        modulesCompleted: 1,
      },
    },
  ]);

  if (!modulesCompleted || modulesCompleted.length === 0) {
    return next(new AppError("No weekly responses found", 404));
  }

  const columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Department", key: "department", width: 20 },
    { header: "Modules Completed", key: "modulesCompleted", width: 20 },
  ];

  setDownloadHeaders(res, "weekly_questions");

  await exportToExcel(res, modulesCompleted, "Weekly Questions", columns);
};

const getCurrentWeekRange = () => {
  const currentDate = moment().startOf("isoWeek");
  const weekStart = currentDate.toDate();
  const weekEnd = currentDate.endOf("isoWeek").toDate();
  return { weekStart, weekEnd };
};

export const handleDownloadBelow80Scorers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { weekStart, weekEnd } = getCurrentWeekRange();

  const users = await WeeklyQuestion.aggregate([
    {
      $match: {
        date: {
          $gte: weekStart,
          $lte: weekEnd,
        },
      },
    },
    {
      $addFields: {
        totalScore: {
          $sum: "$weeklyQuestionModule.score",
        },
      },
    },
    {
      $lookup: {
        from: "weeklyresponses",
        localField: "_id",
        foreignField: "weeklyQuestion",
        as: "responses",
      },
    },
    {
      $unwind: {
        path: "$responses",
        preserveNullAndEmptyArrays: false, // Exclude results without responses
      },
    },
    {
      $match: {
        $expr: {
          $lt: ["$responses.score", { $multiply: ["$totalScore", 0.8] }],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "responses.user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        moduleName: 1,
        totalScore: 1,
        "responses.score": 1,
        "userDetails.name": 1,
        "userDetails.department": 1,
        "userDetails.contact": 1,
        "userDetails.email": 1,
      },
    },
  ]);

  if (!users || users.length === 0) {
    return next(new AppError("No Users found", 404));
  }

  const columns = [
    { header: "Name", key: "userDetails.name", width: 25 },
    { header: "Department", key: "userDetails.department", width: 20 },
    { header: "Score", key: "responses.score", width: 20 },
    { header: "Contact", key: "userDetails.contact", width: 20 },
    { header: "Email", key: "userDetails.email", width: 20 },
    { header: "Module Name", key: "moduleName", width: 20 },
  ];

  setDownloadHeaders(res, "weekly_questions");

  await exportToExcel(res, users, "Weekly Questions", columns);
};





export const handleDownloadReattempted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { weekStart, weekEnd } = getCurrentWeekRange();

  
  const responses = await WeeklyResponse.aggregate([
    {
      $match: {
        createdAt: {
          $gte: weekStart,
          $lte: weekEnd,
        },
        reattempts: { $ne: [] }, 
      },
    },
    {
      $lookup: {
        from: "users", 
        localField: "user", 
        foreignField: "_id", 
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails", 
    },
    {
      $addFields: {
        bestScore: {
          $max: "$reattempts.score", 
        },
      },
    },
    {
      $project: {
        _id: 1,
        "userDetails.name": 1,
        "userDetails.department": 1,
        "userDetails.contact": 1,
        "userDetails.email": 1,
        reattempts: 1, 
        bestScore: 1, 
      },
    },
  ]);


  console.log(responses)

  const columns = [
    { header: "Name", key: "userDetails.name", width: 25 },
    { header: "Department", key: "userDetails.department", width: 20 },
    { header: "Contact", key: "userDetails.contact", width: 20 },
    { header: "Email", key: "userDetails.email", width: 20 },
    { header: "Best Score", key: "bestScore", width: 20 },
  ];

  setDownloadHeaders(res, "weekly_questions");

  await exportToExcel(res, responses, "Weekly Questions", columns);
};






export const handleDownloadProgressReattempt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { weekStart, weekEnd } = getCurrentWeekRange();

  const users = await WeeklyQuestion.aggregate([
    {
      $match: {
        date: {
          $gte: weekStart,
          $lte: weekEnd,
        },
      },
    },
    {
      $addFields: {
        totalScore: {
          $sum: "$weeklyQuestionModule.score",
        },
      },
    },
    {
      $lookup: {
        from: "weeklyresponses",
        localField: "_id",
        foreignField: "weeklyQuestion",
        as: "responses",
      },
    },
    {
      $unwind: {
        path: "$responses",
        preserveNullAndEmptyArrays: false, 
      },
    },
    {
      $addFields: {
        bestScore: {
          $max: "$responses.reattempts.score", 
        },
      },
    },
    {
      $match: {
        $expr: {
          $gt: ["$bestScore", { $multiply: ["$totalScore", 0.8] }],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "responses.user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        moduleName: 1,
        totalScore: 1,
        "responses.score": 1,
        "bestScore":1,
        "userDetails.name": 1,
        "userDetails.department": 1,
        "userDetails.contact": 1,
        "userDetails.email": 1,
      },
    },
  ]);


  console.log(users)

  if (!users || users.length === 0) {
    return next(new AppError("No Users found", 404));
  }

  const columns = [
    { header: "Name", key: "userDetails.name", width: 25 },
    { header: "Department", key: "userDetails.department", width: 20 },
    { header: "Score", key: "bestScore", width: 20 },
    { header: "Contact", key: "userDetails.contact", width: 20 },
    { header: "Email", key: "userDetails.email", width: 20 },
    { header: "Module Name", key: "moduleName", width: 20 },
  ];

  setDownloadHeaders(res, "weekly_questions");

  await exportToExcel(res, users, "Weekly Questions", columns);
};
