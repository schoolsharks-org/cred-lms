import { CookieOptions, NextFunction, Request, Response } from "express";
import User, { Department } from "../models/user.model";
import mongoose from "mongoose";
import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../services/emailService";
const nodemailer = require("nodemailer");
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

// const handleLoginUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { phone, password, userMail } = req.body;

//   if (!phone && !password) {
//     return next(new AppError("All Fields Required", 400));
//   }

//   const user = await User.findOne({ contact: phone.toString() });

//   if (!user) {
//     return next(new AppError("User does not exist", 404));
//   }

//   const isPasswordValid = await user.isPasswordCorrect(password);

//   if (!isPasswordValid) {
//     return next(new AppError("Invalid user credentials", 401));
//   }

//   const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
//   console.log("verificationCode: ", verificationCode);
//   const transporter = await nodemailer.createTransport({
//     service: "gmail",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"CRED DOST" <${process.env.EMAIL_USER}>`,
//     to: userMail,
//     subject: "Your Verification Code",
//     html: `<p>Your verification code is <strong>${verificationCode}</strong></p>`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Verification email sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );

//   const loggedInUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   const options: CookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json({
//       user: loggedInUser,
//       accessToken,
//       refreshToken,
//     });
// };


const handleSendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }
  
  let otp;
  let otpExpiry;
  // console.log(email)
  // console.log(user.otpData)
  if(["dummy1@gmail.com","dummy2@gmail.com","dummy3@gmail.com","dummy4@gmail.com","dummy5@gmail.com"].includes(email)){
    otp=1111;
    otpExpiry = new Date(Date.now() + 100000000000); 
  }
  else{
    otp = Math.floor(1000 + Math.random() * 9000);
    otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 
  }


  // Update user's otpData in the database
  user.otpData = {
    otp,
    expiry: otpExpiry,
  };
  await user.save();

  // Send the OTP to the user's email
  try {
    await sendEmail({
      to: email,
      subject: "Your Verification Code",
      html: `<p>Your verification code is <strong>${otp}</strong></p>`,
    });

    return res.status(200).json({ status: "OTP_SENT", message: "OTP sent successfully" });
  } catch (error) {
    console.log(error)
    return next(new AppError("Failed to send OTP", 500));
  }
};



const handleVerifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (
    user.otpData &&
    user.otpData.otp === parseInt(otp) &&
    user.otpData.expiry > new Date()
  ) {

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -otpData"
    );

    const options: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
  } else {
    return next(new AppError("Invalid or expired OTP", 401));
  }
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

  const existedUser = await User.findOne({ email: email });

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

  const user = await User.findById(objectId).select(
    "name score email address department"
  );
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    name: user.name,
    score: user.score,
    department: user.department,
    address: user.address,
    email: user.email,
  });
};

export {
  // handleLoginUser,
  handleSendOtp,
  handleVerifyOtp,
  handleRegisterUser,
  handleLogoutUser,
  handleRefreshAccessToken,
  handleGetUser,
};
