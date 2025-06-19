import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { toast } from "sonner";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  userLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  userLoading: true,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      // console.log(credentials)
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/login`,
        credentials,
        { withCredentials: true }
      );
      // console.log(res.data.data);
      toast.success("Logged in successfully ");
      return res.data.data;
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/signup",
  async (
    credentials:
      | FormData
      | {
          userName: string;
          email: string;
          password: string;
          fullName: string;
        },
    thunkAPI
  ) => {
    try {
      const isFormData = credentials instanceof FormData;

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/register`,
        credentials,
        {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(res);
      console.log("res.data", res.data);
      toast.success(res.data.message);

      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response.data.message || "Signup Failed"
      );
    }
  }
);

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/user/auth/me`, {
      withCredentials: true,
    });
    console.log("getUser data ", res.data);
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const googleAuthLoginUser = createAsyncThunk(
  "auth/google-auth",
  async (userData: { credential: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/google-auth`,
        { userData },
        { withCredentials: true }
      );

      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

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
        // console.log("act" , action.payload);
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log("act", action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
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
      })

      .addCase(googleAuthLoginUser.pending, (state, _) => {
        state.loading = true;
      })
      .addCase(googleAuthLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleAuthLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
