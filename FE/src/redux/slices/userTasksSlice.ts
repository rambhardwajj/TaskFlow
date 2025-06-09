import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  _id: string;
  title: string;
  desc: string;
  project: Project;
  assignedTo: User;
  assignedBy: User;
  status: TaskStatus;
  attachments: Attachment[];
  createdAt: string; // or Date if you're parsing it
  updatedAt: string; // or Date
  __v: number;
}

interface Avatar {
  url: string;
  localPath: string;
  _id: string;
}

interface User {
  _id: string;
  userName: string;
  email: string;
  avatar: Avatar;
}

interface Project {
  _id: string;
}

interface Attachment {
  mimetype: string;
  size: number;
  _id: string;
}

interface UserTasks {
  byId: Record<string, Task>;
  userTasks: Record<TaskStatus, string[]>;
  loading: boolean;
  error: string | null;
}

const initialState: UserTasks = {
  byId: {},
  userTasks: {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  },
  loading: false,
  error: null,
};

export const fetchUserTasks = createAsyncThunk<{ tasks: Task[] }>(
  "userTasks/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:8200/api/v1/task/getAll`, {
        withCredentials: true,
      });
      return { tasks: res.data.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error geting tasks"
      );
    }
  }
);

const userTasksSlice = createSlice({
  name: "userTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        const { tasks } = action.payload;
        const groupedTasks: Record<TaskStatus, string[]> = {
          TODO: [],
          IN_PROGRESS: [],
          DONE: [],
        };

        tasks.forEach((task) => {
          const id = task._id;
          const status = (task.status || "TODO").toUpperCase() as TaskStatus;
          state.byId[id] = task;
          groupedTasks[status].push(id);
        });
        state.userTasks = groupedTasks;
        state.loading = false;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userTasksSlice.reducer;
