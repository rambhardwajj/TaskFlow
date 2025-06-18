import { FC, useState } from "react";
import {
  CalendarDays,
  ListTodo,
  Paperclip,
  Plus,
  SquareCheck,
  Trash,
  X,
} from "lucide-react";
import { fetchProjectTasks, Task } from "@/redux/slices/projectsTasksSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";
import AssignedUserDialog from "./AssignedUserDialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";

export const TaskCard: FC<Task> = ({
  _id,
  title,
  desc,
  attachments,
  updatedAt,
  assignedTo,
  assignedBy,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subTasks, setSubTasks] = useState<
    { title: string; _id: string; isCompleted: boolean }[]
  >([]);
  const { projectId } = useParams();
  const [open, setOpen] = useState(false);
  const [subTasksOpen, setSubTasksOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const addSubTask = async () => {
    if (!subtaskTitle.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/tasks/${_id}/subTasks`,
        { title: subtaskTitle },
        {
          withCredentials: true,
        }
      );

      console.log("Subtask created:", res.data);
      setSubtaskTitle("");
      setOpen(false);
      // optionally trigger refetch/subtask update
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Error submitting subtask:", error);
    }
  };

  const deleteSubTask = async (subtaskId: string) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/tasks/${_id}/delete/subTasks/${subtaskId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Subtask deleted:", res.data);
      getAllSubtasks();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Error is delting , ", error);
    }
  };

  const getAllSubtasks = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/tasks/${_id}/subTasks/getAll`,
        { withCredentials: true }
      );

      console.log("Retrieved Subtasks", res.data.data);

      setSubTasks(res.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const updateSubTask = async (subtask: any) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/tasks/${_id}/update/subTasks/${subtask._id}`,
        {
          title: subtask.title,
          isCompleted: true,
        },
        { withCredentials: true }
      );

      console.log(res.data);
      getAllSubtasks();
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/delete/tasks/${taskId}`,
        { withCredentials: true }
      );
      toast.success("Task deleted successfully");
      console.log("Task deleted:", res.data);

      if (projectId) {
        dispatch(fetchProjectTasks(projectId));
      }
      setDelOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.message);

      console.log("Error in deleting the task", error);
    }
  };

  return (
    <>
      <div className="max-w-[29vw] bg-neutral-950 p-4 rounded-md border border-neutral-800 hover:border-blue-500 transition-all hover:shadow-lg group cursor-pointer space-y-1">
        {/* First line  */}
        <div className="flex justify-between">
          <p className="font-semibold text-cyan-500 group-hover:text-blue-300 text-sm transition truncate overflow-hidden whitespace-nowrap">
            {title}
          </p>
          <div className="flex gap-2 items-center ">
            {/* List  Subtaks Dialog box */}
            <div onClick={(e) => e.stopPropagation()}>
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
                    <DialogTitle className="text-white mb-3">
                      All SubTasks
                    </DialogTitle>
                    {subTasks.length === 0 ? (
                      <p className="text-zinc-500 text-sm">
                        No Subtasks found.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {subTasks.map((subtask) => (
                          <li
                            key={subtask._id}
                            className={`text-sm text-white p-2 rounded flex justify-between border ${
                              subtask.isCompleted
                                ? "border-green-600"
                                : "border-zinc-700"
                            }`}
                          >
                            {subtask.title}
                            <div className="">
                              {!subtask.isCompleted && (
                                <button
                                  onClick={(e) => {
                                    updateSubTask(subtask);
                                    e.stopPropagation();
                                  }}
                                >
                                  <SquareCheck className="w-6 cursor-pointer hover:scale-[1.3] hover:text-green-600 mr-2  " />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  deleteSubTask(subtask._id);
                                  e.stopPropagation();
                                }}
                              >
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
                      className="cursor-pointer"
                      type="button"
                      variant="secondary"
                      onClick={() => setSubTasksOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* + Create SubTask Dialog box */}
            <div onClick={(e) => e.stopPropagation()}>
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
                      className="bg-zinc-800 text-white max-w-[30vw] "
                      value={subtaskTitle}
                      onChange={(e) => setSubtaskTitle(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      className="cursor-pointer"
                      type="button"
                      variant="secondary"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="hover:bg-cyan-700 cursor-pointer"
                      onClick={addSubTask}
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Delete Task  */}
            <div onClick={(e) => e.stopPropagation()}>
              <Dialog open={delOpen} onOpenChange={setDelOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <button>
                        <Trash className="w-4 cursor-pointer hover:scale-[1.3] hover:text-red-600 " />
                      </button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete Task</TooltipContent>
                </Tooltip>
                <DialogContent className="bg-[#1e1e1e] text-white border border-zinc-700 rounded-lg p-6 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-red-500">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Delete Task??
                        </DialogTitle>
                      </DialogHeader>
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Are you sure you want to delete this task? This action is{" "}
                      <span className="text-red-500 font-semibold">
                        permanent
                      </span>{" "}
                      and cannot be undone.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      className="cursor-pointer px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
                      onClick={() => setDelOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="cursor-pointer px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-sm font-semibold"
                      onClick={() => {
                        setDelOpen(true);
                        handleDeleteTask(_id);
                      }}
                    >
                      Delete Task
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* 2nd Line  */}
        {desc && (
          <div className=" bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-[10px] font-medium truncate overflow-hidden whitespace-nowrap max-w-[200px]">
            {desc}
          </div>
        )}

        {/* 3rd Line  */}
        <div className="flex items-center justify-between  text-zinc-400 mt-1">
          {/* Calendar  */}
          <div className="flex items-center gap-2 text-[10px]">
            <CalendarDays size={14} />
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>

          {/* Attachments  */}
          <div onClick={(e) => e.stopPropagation()}>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    {attachments && attachments?.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] ">
                        <Paperclip
                          size={12}
                          className="hover:text-cyan-600 hover:scale-150"
                        />
                        <span>{attachments.length}</span>
                      </div>
                    )}
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="border">
                  <p> Attachments </p>
                </TooltipContent>
                <DialogContent className="bg-[#1a1a1a] border border-[#2a2a2a] max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 text-red-500">
                  <div className="mt-6">
                    <h4 className="text-white text-lg font-semibold mb-3">
                      Attachments
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                      {attachments && attachments.length > 0 ? (
                        attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="min-w-[140px] h-[80px] bg-zinc-800 rounded-lg border text-white border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                          >
                            <img
                              src={att.url}
                              alt={`attachment-${idx}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-400 text-sm">
                          No attachments available.
                        </p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Tooltip>
            </Dialog>
          </div>
        </div>

        {/* 4th line  */}
        <div className="flex items-center justify-between mt-3">
          {/* Assigned To  */}
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <img
                      src={assignedTo.avatar}
                      alt={assignedTo.userName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="border">
                  <p> Assigned User </p>
                </TooltipContent>
              </Tooltip>
              <AssignedUserDialog
                user={{
                  avatar: assignedTo.avatar,
                  userName: assignedTo.userName,
                  email: assignedTo.email,
                }}
              />
            </Dialog>
            <span className="text-[10px] text-zinc-400">
              Assignie: {assignedTo.userName}
              {/* <p className="font-bold text-xs hover:text-cyan-600">
                {assignedTo.email}
              </p> */}
            </span>
          </div>
          {/* Assigned By  */}
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <img
                      src={assignedBy.avatar}
                      alt={assignedBy.userName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="border">
                  <p> Reporting To </p>
                </TooltipContent>
              </Tooltip>
              <AssignedUserDialog
                user={{
                  avatar: assignedBy.avatar,
                  userName: assignedBy.userName,
                  email: assignedBy.email,
                }}
              />
            </Dialog>
            <span className="text-[10px] text-zinc-400">
              Reporter: {assignedBy.userName}
              {/* <p className="font-bold text-xs hover:text-cyan-600">
                {assignedBy.email}
              </p> */}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
