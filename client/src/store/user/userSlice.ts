import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, getUser } from './userActions';

export interface User {
  name: string;
  score: number;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: User = {
  name: '',
  score: 0,
  authenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ name: string; score: number }>) => {
        state.loading = false;
        state.authenticated = true;
        state.name = action.payload.name;
        state.score = action.payload.score;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<{ name: string; score: number }>) => {
        state.loading = false;
        state.authenticated = true;
        state.name = action.payload.name;
        state.score = action.payload.score;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default userSlice.reducer;
