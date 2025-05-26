// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./pages/Projects";
import {Layout} from "./pages/Layout";
import TasksOfProject from "./pages/TasksOfProject";
import {Dashboard} from "./pages/Dashboard";
import CreateProjectPage from "./pages/CreateProject";
import MyTasks from "./pages/MyTasks";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="projects" element={<Projects />} />
          <Route path="projects/create" element={<CreateProjectPage />} />
          <Route path=":projectId/tasks" element={<TasksOfProject />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route index element={<Dashboard />} />
          {/* <Route path=":projectId" element={<ProjectPage />} /> */}

        </Route>
      </Routes>
    </Router>
  );
}
