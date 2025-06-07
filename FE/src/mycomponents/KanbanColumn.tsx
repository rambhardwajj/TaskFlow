import { FC, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { fetchProjectTasks, Task } from "@/redux/slices/projectsTasksSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
}

const KanbanColumn: FC<KanbanColumnProps> = ({ title, tasks, onAddTask }) => {
  const { projectId } = useParams();
  console.log(projectId);

  const dispatch = useDispatch<AppDispatch>();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setEditMode(false);
  };

  const handleInputChange = (field: keyof Task, value: string) => {
    if (!selectedTask) return;
    setSelectedTask({ ...selectedTask, [field]: value });
  };

  const handleSaveTask = async () => {
    console.log(selectedTask);
    if (!selectedTask) return;
    const taskId = selectedTask._id;
    if (!selectedTask.title?.trim()) {
      return toast.error("Title is required");
    }

    if (!selectedTask.assignedTo.userName) {
      return toast.error("Assignee is missing");
    }

    try {
      const res = await axios.patch(
        `http://localhost:8200/api/v1/task/project/${projectId}/update/tasks/${taskId}`,
        {
          title: selectedTask.title,
          desc: selectedTask.desc,
          email: selectedTask.assignedTo.email,
          status: selectedTask.status,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data) {
        toast.success("Task updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    } finally {
      setSelectedTask(null);
      if (projectId) dispatch(fetchProjectTasks(projectId));
    }
  };

  return (
    <div className="min-w-[250px] w-[80vw] sm:min-w-[300px] bg-neutral-900 mr-1 p-4 rounded-lg shadow-lg flex flex-col gap-4 transition hover:scale-[1.003]">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-sm">{title}</div>
        <button
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          onClick={onAddTask}
        >
          <Plus size={14} /> Add task
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-100px)] pr-2">
        {tasks.map((task) => (
          <div key={task._id} onClick={() => handleCardClick(task)}>
            <TaskCard {...task} />
          </div>
        ))}
      </div>

      {/* Task Detail Dialog */}
      {/* <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}> */}
      <Dialog
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null);
        }}
      >
        <DialogContent className="bg-[#1e1e1e] border border-[#333] max-w-4xl mx-auto rounded-lg shadow-2xl p-6 space-y-1  max-h-[70vh] overflow-y-scroll">
          {/* Tab Header */}
          <div className="flex gap-6 border-b border-zinc-700 pb-2 text-sm font-medium text-zinc-400">
            <button className="text-white border-b-2 border-blue-600 pb-1">
              General
            </button>
          </div>

          {selectedTask && (
            <>
              {/* Title & Description */}
              <div className="space-y-4">
                <h2 className="text-white text-2xl font-semibold tracking-tight">
                  {editMode ? "Edit Task" : "Task Details"}
                </h2>
                {!editMode && (
                  <p className="text-zinc-400 text-sm">
                    Comprehensive view of your selected task
                  </p>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-4 bg-[#2a2a2a] border border-[#444] rounded-md p-4">
                <h3 className="text-white font-semibold text-base">
                  Description
                </h3>
                {editMode ? (
                  <Textarea
                    className="bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-600 rounded-lg min-h-[100px]"
                    value={selectedTask.desc}
                    onChange={(e) => handleInputChange("desc", e.target.value)}
                  />
                ) : (
                  <ul className="list-disc pl-5 text-zinc-300 text-sm space-y-1">
                    
                    <li>{selectedTask.desc}</li>
                  </ul>
                )}
              </div>


              {/* Status */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-zinc-400">
                  Status
                </label>
                <p className="inline-block px-3 py-1 text-sm rounded-full bg-zinc-800 text-white border border-zinc-600">
                  {selectedTask.status}
                </p>
              </div>

              {/* Assignee & Reporter */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Assignee */}
                <div className="bg-[#2a2a2a] rounded-md p-4 w-full sm:w-1/2 border border-[#444]">
                  <h4 className="text-zinc-400 text-xs mb-1">Assignee</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTask.assignedTo.avatar}
                      className="w-8 h-8 rounded-full border border-zinc-700"
                    />
                    <p className="text-white text-sm font-medium">
                      {selectedTask.assignedTo.userName}
                    </p>
                  </div>
                </div>
                {/* Reporter */}
                <div className="bg-[#2a2a2a] rounded-md p-4 w-full sm:w-1/2 border border-[#444]">
                  <h4 className="text-zinc-400 text-xs mb-1">Reporter</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTask.assignedBy.avatar}
                      className="w-8 h-8 rounded-full border border-zinc-700"
                    />
                    <p className="text-white text-sm font-medium">
                      {selectedTask.assignedBy.userName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h4 className="text-white font-semibold mb-2">Attachments</h4>
                <div className="flex gap-3 overflow-x-auto">
                  {selectedTask.attachments?.map((att, idx) => (
                    <div
                      key={idx}
                      className="min-w-[120px] h-[70px] bg-zinc-800 rounded-md border border-zinc-600 overflow-hidden"
                    >
                      <img
                        src={att.url}
                        alt="attachment"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setEditMode((prev) => !prev)}
                  className="w-full sm:w-auto bg-transparent hover:bg-zinc-800 text-white border border-zinc-700"
                >
                  {editMode ? "Cancel Edit" : "Edit"}
                </Button>
                {editMode && (
                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    onClick={handleSaveTask}
                  >
                    Save Changes
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { KanbanColumn };
