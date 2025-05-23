import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";

const sections = ["Backlog", "Up next", "In progress"];

const mockTasks: any = {
  Backlog: [
    { title: "Assign tasks", due: "03/09", label: "High", color: "red" },
  ],
  "Up next": [
    {
      title: "Add duration",
      due: "02/28",
      checklist: ["Add attachments", "Add labels", "Add effort"],
      label: "Blue",
      color: "blue",
    },
  ],
  "In progress": [
    {
      title: "Customize buckets",
      due: "02/26",
      label: "Pink",
      color: "pink",
    },
  ],
};

const colorMap: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  pink: "bg-pink-400",
};

export default function ProjectPage() {
  const { projectId } = useParams();

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen w-full bg-zinc-950 text-white p-4 overflow-hidden">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Project: {projectId}</h2>
          <div className="flex gap-4">
            <button className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 transition">
              Filters
            </button>
            
          </div>
        </header>

        <div className="flex gap-6 overflow-x-auto h-[80vh] overflow-y-hidden pb-4">
          {sections.map((section) => (
            <div
              key={section}
              className="min-w-[300px] w-[80vw] bg-zinc-800 p-4 rounded-lg shadow-lg flex flex-col gap-4 transition hover:scale-[1.01]"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{section}</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                  <Plus size={14} /> Add task
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-100px)] pr-2">
                {mockTasks[section]?.map((task: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-zinc-900 p-4 rounded-md border border-zinc-700 hover:border-blue-500 transition-all hover:shadow-lg group cursor-pointer"
                  >
                    <p className="font-semibold mb-2 group-hover:text-blue-300 transition">
                      {task.title}
                    </p>

                    {task.checklist && (
                      <ul className="text-sm list-disc list-inside space-y-1 mb-2 text-zinc-400">
                        {task.checklist.map((item: any, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {task.label && (
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${colorMap[task.color]} text-zinc-900 font-bold`}
                      >
                        {task.label}
                      </span>
                    )}

                    <div className="text-xs text-zinc-500 mt-2">📅 {task.due}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

         
        </div>
      </div>
    </div>
  );
}
