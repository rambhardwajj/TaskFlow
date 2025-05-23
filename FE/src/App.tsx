import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projectId" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}
