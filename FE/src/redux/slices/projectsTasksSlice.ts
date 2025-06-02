import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  title: string;
  desc?: string;
  attachments?: any[];
  updatedAt: string;
  status?: TaskStatus;
  assignedTo: {
    userName: string;
    avatar: string;
  };
  assignedBy: {
    userName: string;
    avatar: string;
  };
}

interface ProjectTasksState {
  tasksByProject: Record<string, Record<TaskStatus, Task[]>>;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectTasksState = {
  tasksByProject: {},
  loading: false,
  error: null,
};

// Async thunk to fetch tasks for a specific project
export const fetchProjectTasks = createAsyncThunk<
  { projectId: string; tasks: Task[] },
  string
>("projectTasks/getAllProjectTasks", async (projectId, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:8200/api/v1/task/project/${projectId}/tasks`,
      { withCredentials: true }
    );
    return { projectId, tasks: response.data.data };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Error fetching tasks"
    );
  }
});

const projectTasksSlice = createSlice({
  name: "projectTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        const { projectId, tasks } = action.payload;
        const groupedTasks: Record<TaskStatus, Task[]> = {
          TODO: [],
          IN_PROGRESS: [],
          DONE: [],
        };
        tasks.forEach((task) => {
          const status = (task.status || "TODO").toUpperCase() as TaskStatus;
          groupedTasks[status].push(task);
        });
        state.tasksByProject[projectId] = groupedTasks;
        state.loading = false;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectTasksSlice.reducer;
