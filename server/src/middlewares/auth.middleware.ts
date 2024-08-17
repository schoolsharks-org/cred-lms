import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";

export const authMiddleware = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError("Unauthorized request", 401);
    }
    

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new AppError("Invalid Access Token", 401);
    }

    req.user = user;
    next();
  } catch (error: any) {
    throw new AppError(error?.message || "Invalid access token", 401);
  }
});
