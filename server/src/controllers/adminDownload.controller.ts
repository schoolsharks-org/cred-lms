import { NextFunction, Request, Response } from "express";
import ExcelJS from "exceljs";
import User from "../models/user.model"; 

export const handleTotalEmployeesDownload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}, "name department email phone score");

    if (!users || users.length === 0) {
      return next(new AppError("No users found", 404));
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Score", key: "score", width: 10 },
    ];

    users.forEach(user => {
      worksheet.addRow({
        name: user.name,
        department: user.department,
        email: user.email,
        phone: user.contact,
        score: user.score,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=employees_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end(); 

  } catch (error) {
    next(error);
  }
};
import { write } from "fs";
import { now } from "mongoose";import AppError from "../utils/appError";

