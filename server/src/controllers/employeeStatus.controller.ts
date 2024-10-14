import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError";


export const handleGetEmployeeStatus=async(req:Request,res:Response,next:NextFunction)=>{

    const response=await User.find({},"name employeeId department email contact status")
    if(!response){
        return next(new AppError("No Employees Found",404))
    }

    return res.status(200).json({employees:response})
}