import { Plus, Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import axios from "axios";
import { fetchUserTasks, myTask } from "@/redux/slices/userTasksSlice";
import { Task } from "@/redux/slices/projectsTasksSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { API_BASE_URL } from "config";

export const AttachmentSection = ({
  selectedTask,
  projectId,
}: {
  selectedTask: myTask | Task;
  projectId: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedTask) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("attachments", files[i]);
    }

    try {
      toast.loading("wait");
      await axios.post(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/tasks/${selectedTask._id}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch(fetchUserTasks());

      toast.dismiss();

      toast.success(
        "Upload attachment successful, please refresh the page to see the changes"
      );
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const deleteAttachment = async (
    taskId: string,
    projectId: string,
    attachmentId: string
  ) => {
    try {
      toast.loading("wait");

      await axios.delete(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,
        { withCredentials: true }
      );

      dispatch(fetchUserTasks());
      toast.dismiss();
      toast.success(
        "Attachment deleted, please refresh the page to see the changes"
      );
    } catch (error) {
      toast.error("Delete attachment failed");
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {selectedTask.attachments?.map((att: any, idx: number) => (
        <div>
          <div
            key={idx}
            className=" min-w-[120px] h-[70px] bg-neutral-900 rounded-md border border-zinc-700 overflow-hidden"
          >
            <img
              src={att.url}
              alt={`attachment-${idx}`}
              className="object-cover w-full h-full"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Trash
                fill="#eb1313"
                className="cursor-pointer hover:scale-[1.2] text-[#eb1313] relative top-0  m-[-67px] ml-[1px]"
                onClick={() => {
                  deleteAttachment(selectedTask._id, projectId, att._id);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>Delete Attachment</TooltipContent>
          </Tooltip>
        </div>
      ))}

      <div
        className="cursor-pointer flex justify-center items-center min-w-[120px] h-[70px] bg-neutral-900 rounded-md border border-zinc-700 overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        <Plus className="text-white hover:scale-[1.3]" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};
