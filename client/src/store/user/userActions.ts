/* eslint-disable @typescript-eslint/no-explicit-any */
import userApi from "@/api/userApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    credentials: { phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.post("/login", credentials, {
        withCredentials: true,
      });

      const { user } = response.data;

      return { name: user.name, score: user.score };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
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
