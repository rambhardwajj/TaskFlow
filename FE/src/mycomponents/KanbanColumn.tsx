import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { Task } from "@/redux/slices/projectsTasksSlice";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
}

const KanbanColumn: FC<KanbanColumnProps> = ({ title, tasks, onAddTask }) => {
  const [isSubTaskModalOpen, setSubTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <div className="min-w-[250px] w-[80vw] sm:min-w-[300px] bg-neutral-900 mr-1 p-4 rounded-lg shadow-lg flex flex-col gap-4 transition hover:scale-[1.003]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          onClick={onAddTask}
        >
          <Plus size={14} /> Add task
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto  max-h-[calc(80vh-100px)] pr-2">
        {tasks.map((task, idx) => (
          <TaskCard
            key={idx}
            
            {...task}
          />
        ))}
      </div>
    </div>
  );
};

export { KanbanColumn };
