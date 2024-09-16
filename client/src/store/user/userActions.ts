/* eslint-disable @typescript-eslint/no-explicit-any */
import userApi from "@/api/userApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (
//     credentials: { phone: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await userApi.post("/login", credentials, {
//         withCredentials: true,
//       });

//       const { user } = response.data;

//       return {
//         name: user.name,
//         score: user.score,
//         email: user.email,
//         department: user.department,
//         address: user.address,
//       };
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to login"
//       );
//     }
//   }
// );

export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/send-otp", { email });

      if (response.status === 200) {
        return "OTP_SENT";
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.post("/verify-otp", { email, otp });

      const {
        name,
        score,
        address,
        email: userEmail,
        department,
      } = response.data.user;

      return { name, score, address, email: userEmail, department };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get("/get-user");

      const { name, score, address, email, department } = response.data;
      return { name, score, address, email, department };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const getTrackLevels = async () => {
  try {
    const response = await userApi.get("/track-levels");
    return response.data.monthly_status;
  } catch (error: any) {
    return error;
  }
};

export const getDailyUpdates = async () => {
  try {
    const response = await userApi.get("/daily-updates");
    return response.data;
  } catch (error: any) {
    return error;
  }
};
