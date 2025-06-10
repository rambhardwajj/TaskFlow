import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store/store";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface myTask {
  _id: string;
  title: string;
  desc: string;
  project: myProject;
  assignedTo: myUser;
  assignedBy: myUser;
  status: TaskStatus;
  attachments: myAttachment[];
  createdAt: string; // or Date if you're parsing it
  updatedAt: string; // or Date
  __v: number;
}

export interface myAvatar {
  url: string;
  localPath: string;
  _id: string;
}

export interface myUser {
  _id: string;
  userName: string;
  email: string;
  avatar: myAvatar;
}

export interface myProject {
  _id: string;
}

export interface myAttachment {
  mimetype: string;
  size: number;
  _id: string;
}

export interface UserTasks {
  byId: Record<string, myTask>;
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

export const fetchUserTasks = createAsyncThunk<{ tasks: myTask[] }>(
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

export const updateTaskStatus = createAsyncThunk(
  "userTasks/updateTaskStatus",
  async ({
    taskId,
    newStatus,
  }: {
    taskId: string;
    newStatus: TaskStatus;
  }, { getState }) => {
    const state = getState() as RootState;
    const task = state.userTasks.byId[taskId];
    const projectId = task.project._id; // Get project ID from the task in state
    
    const response = await axios.patch(
      `http://localhost:8200/api/v1/task/project/${projectId}/update/tasks/${taskId}`,
      { status: newStatus },
      { withCredentials: true }
    );

    console.log(response.data.data)

    return { taskId, newStatus };
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
      })


      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, newStatus } = action.payload;
        const task = state.byId[taskId];

        if (task) {
          // Remove from old status array
          const oldStatus = task.status;
          state.userTasks[oldStatus] = state.userTasks[oldStatus].filter(
            (id) => id !== taskId
          );

          // Add to new status array
          state.userTasks[newStatus].push(taskId);

          // Update task status
          state.byId[taskId].status = newStatus;
        }
      });
  },
});

export default userTasksSlice.reducer;
