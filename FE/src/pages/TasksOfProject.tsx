import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { TaskCard } from "../mycomponents/TaskCard";
import { TasksNavigation } from "../mycomponents/TasksNavigation";

export interface Task {
  title: string;
  desc?: string;
  attachments?: any[];
  updatedAt: Date;
  status?: "TODO"|"IN PROGRESS"|"DONE";
  assignedTo: {
    userName: string;
    avatar: string;
  };
  assignedBy: {
    userName: string;
    avatar: string;
  };
}

const sections = ["TODO", "IN PROGRESS", "DONE"];

export default function TasksOfProject() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // API call to get all tasks 
   
  }, [projectId]);

  const tasksBySection: Record<string, Task[]> = {
    "TODO": [],
    "IN PROGRESS": [],
    "DONE": [],
  };

  tasks.forEach((task) => {
    const status = task.status?.toUpperCase() || "TODO";
    if (tasksBySection[status]) {
      tasksBySection[status].push(task);
    }
  });

  return (
    <div className="flex">
      <div className="h-screen w-full bg-neutral-950 text-white p-4 overflow-hidden">
        <TasksNavigation />

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
                {tasksBySection[section]?.map((task, idx) => (
                  <TaskCard key={idx} {...task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
