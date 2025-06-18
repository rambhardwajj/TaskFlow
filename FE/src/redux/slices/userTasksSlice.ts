import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store/store";
import { API_BASE_URL } from "../../../config";

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
      const res = await axios.get(`${API_BASE_URL}/api/v1/task/getAll`, {
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
  async (
    {
      taskId,
      newStatus,
    }: {
      taskId: string;
      newStatus: TaskStatus;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const task = state.userTasks.byId[taskId];

    console.log(task)
    if( !task) {
      console.log("The task doesnot belogs to the user")
    }
    const projectId = task.project._id; // Get project ID from the task in state

    await axios.patch(
      `${API_BASE_URL}/api/v1/task/project/${projectId}/update-status/tasks/${taskId}`,
      { status: newStatus },
      { withCredentials: true }
    );

    // console.log(response.data.data)

    return { taskId, newStatus };
  }
);

const userTasksSlice = createSlice({
  name: "userTasks",
  initialState,
  reducers: {
    addTaskManually: (state, action) => {
    const task = action.payload;
    const status = (task.status.toUpperCase() || "TODO") as TaskStatus;

    // Agar task already nahi hai to hi add karo
    if (!state.byId[task._id]) {
      state.byId[task._id] = task;
      state.userTasks[status].push(task._id);
    }
  },
  },
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
          const status = (task.status.toUpperCase() || "TODO") as TaskStatus;
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

          console.log("task status", task.status)
          const oldStatus = task.status.toUpperCase();
          console.log("oldStatus", oldStatus)

          console.log("userTasks", state.userTasks)
          console.log("userTasks[TODO]", state.userTasks["TODO"])

          // console.log(state.userTasks[oldStatus]);
          // @ts-ignore 
          if (state.userTasks[oldStatus]) {
            console.log(oldStatus)
            // @ts-ignore 
            state.userTasks[oldStatus] = state.userTasks[oldStatus].filter(
              (id: string) => id !== taskId
            );
          }
          // Add to new status array
          state.userTasks[newStatus].push(taskId);
          // Update task status
          state.byId[taskId].status = newStatus;
        }

        state.loading = false;
      });
  },
});

export const { addTaskManually } = userTasksSlice.actions;
export default userTasksSlice.reducer;
