import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  userLoading: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  userLoading: true
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      // console.log(credentials)
      const res = await axios.post(
        "http://localhost:8200/api/v1/user/auth/login",
        credentials,
        { withCredentials: true }
      );
      // console.log(res.data.data);
      return res.data.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    credentials: {
      userName: string;
      email: string;
      password: string;
      fullName: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:8200/api/v1/user/auth/register",
        credentials,
        { withCredentials: true }
      );
      // console.log(res.data.data)
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const res = await axios.get(
      "http://localhost:8200/api/v1/user/auth/me",
      { withCredentials: true }
    );
    console.log("getUser data ", res.data);
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
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
        // console.log(action.payload)
        state.user = action.payload.user;
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
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUser
      .addCase(getUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.userLoading = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
