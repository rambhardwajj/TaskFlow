// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./pages/Projects";
import { Layout } from "./pages/Layout";
import TasksOfProject from "./pages/TasksOfProject";
import { Dashboard } from "./pages/Dashboard";
import CreateProjectPage from "./pages/CreateProject";
import MyTasks from "./pages/MyTasks";
import Login from "./mycomponents/Login";
import Signup from "./mycomponents/Signup";
import ProtectedRoute from "./pages/ProtectedRoute";
import Project from "./pages/Project";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path=":projectId" element={<Project />} />
            <Route path=":projectId/tasks" element={<TasksOfProject />} />
            <Route path="projects/create" element={<CreateProjectPage />} />
            <Route path="tasks" element={<MyTasks />} />
          </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  );
}
