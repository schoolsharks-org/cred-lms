import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUser, sendOtp, verifyOtp } from "./userActions";

export enum authStatus{
  UNAUTHENTICATED="UNAUTHENTICATED",
  OTP_SENT="OTP_SENT",
  AUTHENTICATED="AUTHENTICATED"
}
export interface User {
  name: string;
  score: number;
  email: string;
  address: string;
  department: string;
  authStatus: authStatus;
  loading: boolean;
  error: string | null;
}

const initialState: User = {
  name: "",
  score: 0,
  email: "",
  address: "",
  department: "",
  authStatus: authStatus.UNAUTHENTICATED,
  loading: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.score = action.payload.score ?? state.score;
      state.email=action.payload.email??state.email;
      state.error=action.payload.error??state.error;
      state.authStatus=action.payload.authStatus??state.authStatus
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(sendOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(sendOtp.fulfilled, (state) => {
      state.loading = false;
      state.authStatus = authStatus.OTP_SENT;
    })
    .addCase(sendOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    })
    .addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      verifyOtp.fulfilled,
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
        state.authStatus = authStatus.AUTHENTICATED;
        state.name = action.payload.name;
        state.score = action.payload.score;
        state.address = action.payload.address;
        state.email = action.payload.email;
        state.department = action.payload.department;
        state.loading = false;
      }
    )
    .addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    })
      // .addCase(loginUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(
      //   loginUser.fulfilled,
      //   (
      //     state,
      //     action: PayloadAction<{
      //       name: string;
      //       score: number;
      //       address: string;
      //       email: string;
      //       department: string;
      //     }>
      //   ) => {
      //     state.authenticated = true;
      //     state.name = action.payload.name;
      //     state.score = action.payload.score;
      //     state.address = action.payload.address;
      //     state.email = action.payload.email;
      //     state.department = action.payload.department;
      //     state.loading = false;
      //   }
      // )
      // .addCase(loginUser.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string | null;
      // })
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
          state.authStatus = authStatus.AUTHENTICATED;
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
