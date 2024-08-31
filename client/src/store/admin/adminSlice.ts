import { createSlice } from "@reduxjs/toolkit";

export interface Admin {
  isAuthenticated:boolean;
  loading:boolean;
}

const initialState: Admin = {
 isAuthenticated:false,
 loading:false
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
    //   .addCase(loginUser.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(
    //     loginUser.fulfilled,
    //     (
    //       state,
    //       action: PayloadAction<{
    //         name: string;
    //         score: number;
    //         address: string;
    //         email: string;
    //         department: string;
    //       }>
    //     ) => {
    //       state.authenticated = true;
    //       state.name = action.payload.name;
    //       state.score = action.payload.score;
    //       state.address = action.payload.address;
    //       state.email = action.payload.email;
    //       state.department = action.payload.department;
    //       state.loading = false;
    //     }
    //   )
    //   .addCase(loginUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string | null;
    //   })
  },
});


export default adminSlice.reducer;
