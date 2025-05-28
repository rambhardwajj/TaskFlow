import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (credentials:any, thunkAPI) => {
    try {
        // console.log(credentials)
      const res = await axios.post("http://localhost:8200/api/v1/user/auth/login", credentials);
      console.log(res)
      return res.data;
    } catch (err: any) {
        console.log(err)
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "/auth/signup",
  async (
    credentials: { userName: string; email: string; password: string; fullName: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("http://localhost:8200/api/v1/user/auth/register", credentials);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;