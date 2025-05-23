import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectTable from "../components/ProjectTable";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
            <ProjectTable />
        </main>
      </div>
    </div>
  );
}
