import { CookieOptions, NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (
  userId: mongoose.Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new AppError(
      "Something went wrong while generating refresh and access token",
      500
    );
  }
};

const handleLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phone, password } = req.body;

  if (!phone && !password) {
    return next(new AppError("All Fields Required", 400));
  }

  const user = await User.findOne({ contact: phone.toString() });

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid user credentials", 401));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      user: loggedInUser,
      accessToken,
      refreshToken,
    });
};

const handleRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, password, email, department, contact, address } = req.body;

  if (
    [name, password, email, department, address, contact].some(
      (field) => field?.trim() === ""
    )
  ) {
    return next(new AppError("All fields are required", 400));
  }

  const existedUser = await User.findOne({ contact: contact });

  if (existedUser) {
    return next(
      new AppError("User with email or username already exists", 400)
    );
  }

  const user = await User.create({
    name,
    password,
    email,
    department,
    contact,
    address,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return next(
      new AppError("Something went wrong while registering the user", 500)
    );
  }

  return res.status(201).json(createdUser);
};

const handleLogoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new AppError("UnAuthorized", 401));
    return;
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "Logout Successfull" });
};

const handleRefreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new AppError("Unauthorized request", 401));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return next(new AppError("Invalid refresh token", 401));
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return next(new AppError("Refresh token is expired or used", 401));
    }

    const options: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ accessToken, refreshToken });
  } catch (error: any) {
    return next(new AppError(error?.message || "Invalid refresh token", 400));
  }
};

const handleGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next(new AppError("UnAuthorized", 401));
    return;
  }
  const { _id: userId } = req.user;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const objectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(objectId).select("name score");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    name: user.name,
    score: user.score,
  });
};

export {
  handleLoginUser,
  handleRegisterUser,
  handleLogoutUser,
  handleRefreshAccessToken,
  handleGetUser,
};
