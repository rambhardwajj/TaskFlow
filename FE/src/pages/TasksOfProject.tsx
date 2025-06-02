import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Plus } from "lucide-react";
import { TaskCard } from "../mycomponents/TaskCard";
import { TasksNavigation } from "../mycomponents/TasksNavigation";

export interface Task {
  title: string;
  desc?: string;
  attachments?: any[];
  updatedAt: Date;
  status: "TODO" | "IN PROGRESS" | "DONE";
  assignedTo: {
    userName: string;
    avatar: string;
  };
  assignedBy: {
    userName: string;
    avatar: string;
  };
}

const sections :  Task["status"][] =  ["TODO", "IN PROGRESS", "DONE" ];

export default function TasksOfProject() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${projectId}`,
          { withCredentials: true }
        );
        setTasks(data.data || []);
        console.log(tasks)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchTasks();
  }, [projectId]);

  const tasksBySection: Record<Task["status"] , Task[]> = {
    "TODO": [],
    "IN PROGRESS": [],
    "DONE": [],
  };

  tasks.forEach((task) => {
    const status = task.status || "TODO";
    tasksBySection[status].push(task);
  });

  return (
    <div className="flex">
      <div className="h-screen w-full bg-neutral-950 text-white p-4 overflow-hidden">
        <TasksNavigation />

        {loading ? (
          <div className="text-center mt-10 text-gray-400">Loading tasks...</div>
        ) : error ? (
          <div className="text-center mt-10 text-red-400">{error}</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto h-[80vh] overflow-y-hidden pb-4">
            {sections.map((section) => (
              <div
                key={section}
                className="min-w-[300px] w-[80vw] sm:w-[350px] bg-neutral-900 p-4 rounded-lg shadow-lg flex flex-col gap-4 transition hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{section}</h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                    <Plus size={14} /> Add task
                  </button>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-100px)] pr-2">
                  {tasksBySection[section]?.length > 0 ? (
                    tasksBySection[section].map((task, idx) => (
                      <TaskCard key={idx} {...task} />
                    ))
                  ) : (
                    <div className="text-sm text-zinc-500">No tasks</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
