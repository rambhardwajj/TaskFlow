import { FC, useState } from "react";
import { CalendarDays, Paperclip, Plus } from "lucide-react";
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
  const [subtaskDesc, setSubtaskDesc] = useState("");
  const {projectId } = useParams()
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
  if (!subtaskTitle.trim()) return;

  try {
    const res = await axios.post(
      `/api/v1/task/project/${projectId}/tasks/${_id}/subTasks`,
      {
        title: subtaskTitle,
        desc: subtaskDesc,
      },
      {
        withCredentials: true,
      }
    );

    console.log("Subtask created:", res.data);
    setSubtaskTitle("");
    setSubtaskDesc("");
    setOpen(false);
    // optionally trigger refetch/subtask update
  } catch (error) {
    console.error("Error submitting subtask:", error);
  }
};


  return (
    <>
      <div className="bg-neutral-950 p-4 rounded-md border border-zinc-700 hover:border-blue-500 transition-all hover:shadow-lg group cursor-pointer space-y-2">
        <div className="flex justify-between">
          <p className="font-semibold text-cyan-500 group-hover:text-blue-300 transition">
            {title}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button>
                <Plus className="w-4 cursor-pointer hover:scale-[1.3] hover:text-green-600 " />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create Subtask</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Add a title and description for this subtask.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Subtask Title"
                  className="bg-zinc-800 text-white"
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Subtask Description"
                  className="bg-zinc-800 text-white"
                  value={subtaskDesc}
                  onChange={(e) => setSubtaskDesc(e.target.value)}
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
                <Button onClick={handleSubmit}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* rest of your task card UI... */}
        {desc && (
          <div className="inline-block bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-xs font-medium">
            {desc}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} />
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
          {attachments &&  attachments?.length > 0 && (
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
