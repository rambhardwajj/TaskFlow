
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "config";

export const fetchUserRole = createAsyncThunk(
  "userRole/fetchUserRole",
  async (projectId: string, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/project/${projectId}/getRole`,
        { withCredentials: true }
      );
      return res.data.data.projectMember; 
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch user role"
      );
    }
  }
);

interface UserRoleState {
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserRoleState = {
  role: null,
  loading: false,
  error: null,
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    clearUserRole: (state) => {
      state.role = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.role = null;
      });
  },
});

export const { clearUserRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
