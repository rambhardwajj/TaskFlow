import { FC, useState } from "react";
import {
  CalendarDays,
  ListTodo,
  Paperclip,
  Plus,
  SquareCheck,
  X,
} from "lucide-react";
import { Task } from "@/redux/slices/projectsTasksSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";

export const TaskCard: FC<Task> = ({
  _id,
  title,
  desc,
  attachments,
  updatedAt,
  assignedTo,
  assignedBy,
  status,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subTasks, setSubTasks] = useState<{ title: string; _id: string }[]>(
    []
  );
  const { projectId } = useParams();
  const [open, setOpen] = useState(false);
  const [subTasksOpen, setSubTasksOpen] = useState(false);

  const handleSubmit = async () => {
    if (!subtaskTitle.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8200/api/v1/task/project/${projectId}/tasks/${_id}/subTasks`,
        {
          title: subtaskTitle,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Subtask created:", res.data);
      setSubtaskTitle("");
      setOpen(false);
      // optionally trigger refetch/subtask update
    } catch (error) {
      console.error("Error submitting subtask:", error);
    }
  };

  const getAllSubtasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8200/api/v1/task/project/${projectId}/tasks/${_id}/subTasks/getAll`,
        { withCredentials: true }
      );

      console.log("Retrieved Subtasks", res.data.data);

      setSubTasks(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-neutral-950 p-4 rounded-md border border-zinc-700 hover:border-blue-500 transition-all hover:shadow-lg group cursor-pointer space-y-1">
        {/* First line  */}
        <div className="flex justify-between">
          <p className="font-semibold text-cyan-500 group-hover:text-blue-300 text-sm transition">
            {title}
          </p>
          <div className="flex gap-2 items-center ">
            {/* Subtaks Dialog box */}
            <Dialog open={subTasksOpen} onOpenChange={setSubTasksOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getAllSubtasks();
                        setSubTasksOpen(true);
                      }}
                    >
                      <ListTodo className="w-4 cursor-pointer hover:scale-[1.3] hover:text-cyan-600 z-10 " />
                    </button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p> See all Subtasks</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="bg-neutral-900 border-zinc-700">
                <DialogHeader>
                  <DialogTitle className="text-white">All SubTasks</DialogTitle>
                  {subTasks.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No Subtasks found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {subTasks.map((subtask) => (
                        <li
                          key={subtask._id}
                          className="text-sm text-white border border-zinc-700 p-2 rounded flex justify-between"
                        >
                          {subtask.title}
                          <div>
                            <button>
                              <SquareCheck className="w-6 cursor-pointer hover:scale-[1.3] hover:text-green-600 mr-2 " />
                            </button>
                            <button>
                              <X className="w-6 cursor-pointer hover:scale-[1.3] hover:text-red-600  " />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </DialogHeader>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSubTasksOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Create SubTask Dialog box */}
            <Dialog open={open} onOpenChange={setOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent parent click
                        setOpen(true);
                      }}
                    >
                      <Plus className="w-4 cursor-pointer hover:scale-[1.3] hover:text-green-600 " />
                    </button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p> Create Subtask</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="bg-neutral-900 border-zinc-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Create Subtask
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <Input
                    placeholder="Subtask Title"
                    className="bg-zinc-800 text-white"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="hover:bg-cyan-700" onClick={handleSubmit}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* rest of your task card UI... */}
        {desc && (
          <div className="inline-block bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-[10px] font-medium">
            {desc}
          </div>
        )}
        <div className="flex items-center justify-between  text-zinc-400 mt-1">
          <div className="flex items-center gap-2 text-[10px]">
            <CalendarDays size={14} />
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
          {attachments && attachments?.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip size={14} className="hover:text-cyan-800" />
              <span>{attachments.length}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <img
              src={assignedTo.avatar}
              alt={assignedTo.userName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-[10px] text-zinc-400">
              Assignie:{" "}
              <p className="font-bold text-xs hover:text-cyan-600">
                {assignedTo.userName}
              </p>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={assignedBy.avatar}
              alt={assignedBy.userName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-[10px]  text-zinc-400">
              Reporter:{" "}
              <p className="font-bold hover:text-cyan-600 text-xs">
                {assignedBy.userName}
              </p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
