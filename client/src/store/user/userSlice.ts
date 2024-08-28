import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, getUser } from "./userActions";

export interface User {
  name: string;
  score: number;
  email: string;
  address: string;
  department: string;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: User = {
  name: "",
  score: 0,
  email: "",
  address: "",
  department: "",
  authenticated: false,
  loading: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.score = action.payload.score ?? state.score;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            name: string;
            score: number;
            address: string;
            email: string;
            department: string;
          }>
        ) => {
          state.authenticated = true;
          state.name = action.payload.name;
          state.score = action.payload.score;
          state.address = action.payload.address;
          state.email = action.payload.email;
          state.department = action.payload.department;
          state.loading = false;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            name: string;
            score: number;
            address: string;
            email: string;
            department: string;
          }>
        ) => {
          state.loading = false;
          state.authenticated = true;
          state.name = action.payload.name;
          state.score = action.payload.score;
          state.address = action.payload.address;
          state.email = action.payload.email;
          state.department = action.payload.department;
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
