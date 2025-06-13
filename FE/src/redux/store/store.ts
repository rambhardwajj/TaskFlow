import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import projectReducer from "../slices/projectSlice"
import projectTasksReducer from "../slices/projectsTasksSlice"
import userTasksReducers from "../slices/userTasksSlice"
import userRoleReducer from "../slices/userRoleSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    projectTasks: projectTasksReducer,
    userTasks : userTasksReducers,
    userRole: userRoleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
