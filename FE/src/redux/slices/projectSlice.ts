import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "config";

export interface Project {
  role: string;
  projectId: string;
  name: string;
  createdAt: string;
  memberCount: number;
  createdBy: {
    username: string;
    email: string;
  };
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const getAllProjects = createAsyncThunk(
  "projects/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/project/`,
        { withCredentials: true }
      );
      return response.data.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectsSlice.reducer;
