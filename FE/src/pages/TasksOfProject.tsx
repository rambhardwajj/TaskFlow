import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TasksNavigation } from "../mycomponents/TasksNavigation";
import { KanbanColumn } from "../mycomponents/KanbanColumn";

// Define the type locally or import from a shared types file
export interface Task {
  title: string;
  desc?: string;
  attachments?: any[];
  updatedAt: Date;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  assignedTo: {
    userName: string;
    avatar: string;
  };
  assignedBy: {
    userName: string;
    avatar: string;
  };
}

const sections: Array<NonNullable<Task["status"]>> = ["TODO", "IN_PROGRESS", "DONE"];

export default function TasksOfProject() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // console.log(projectId)
    const fetchTasks = async () => {
      if (!projectId) return;
      
      try {
        
        console.log(" inside Task of Projects ", projectId)
        setLoading(true);
        const response = await axios.get(`http://localhost:8200/api/v1/task/project/${projectId}/tasks`, {withCredentials: true});
        console.log(response.data.data)
        setTasks(response.data.data); // Assuming the data is in `response.data.data`
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const tasksBySection: Record<string, Task[]> = {
    "TODO": [],
    "IN_PROGRESS": [],
    "DONE": [],
  };

  tasks && tasks.forEach((task) => {
    const status = task.status?.toUpperCase() || "TODO";
    if (tasksBySection[status]) {
      tasksBySection[status].push(task);
    }
  });

  return (
    <div className="flex ">
      <div className=" w-full bg-neutral-950 text-white p-4 overflow-hidden">
        <TasksNavigation />

        {loading ? (
          <div className="text-white text-center mt-10">Loading tasks...</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto overflow-scroll h-[70vh] overflow-y-hidden pb-4">
            {sections.map((section) => (
              <KanbanColumn
                key={section}
                title={section}
                tasks={tasksBySection[section]}
                onAddTask={() => console.log(`Add task to ${section}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
