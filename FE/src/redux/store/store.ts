import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import projectReducer from "../slices/projectSlice"
import projectTasksReducer from "../slices/projectsTasksSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    projectTasks: projectTasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
