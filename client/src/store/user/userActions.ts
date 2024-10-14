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
    const getCurrentWeekMonday = (date: Date) => {
      const monday = new Date(date);
      const day = date.getDay();
      const diff = day === 0 ? 6 : day - 1; 
      monday.setDate(date.getDate() - diff); 
      monday.setHours(0, 0, 0, 0); 
      return monday;
    };
    
    const today = new Date();
    
    const currentWeekMonday = getCurrentWeekMonday(today);
    
    const trackLevels = response.data.monthly_status.map((month: any) => ({
      ...month,
      weeks: month.weeks.map((week: any) => {
        const weekDate = new Date(week.date); 
        return {
          ...week,
          status:
            weekDate < currentWeekMonday && week.status === "IN_PROGRESS"
              ? "MISSED"
              : week.status,
        };
      }),
    }));

    return trackLevels;
  } catch (error: any) {
    return error;
  }
};

export const getDailyUpdates = async () => {
  try {
    const response = await userApi.get("/help-section");
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getHelpSectionModule = async (id: string) => {
  try {
    const response = await userApi.get("/help-section-module", {
      params: { _id: id },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getWeeklyQuestionStatus = async () => {
  try {
    const response = await userApi.get("/weekly-question-status");
    return response.data;
  } catch (error) {
    return error;
  }
};
