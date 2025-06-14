import { DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { myTask, TaskStatus } from "@/redux/slices/userTasksSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AttachmentSection } from "./Attachments";

interface EditTaskDialogProps {
  loading: boolean;
  selectedTask: myTask | null;
  editMode: boolean;
  handleInputChange: (field: keyof myTask, value: string) => void;
  handleSaveTask: () => void;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  loading,
  selectedTask,
  editMode,
  handleInputChange,
  handleSaveTask,
  setEditMode,
}) => {
  if (!selectedTask) return null;

  const [editStatus, setEditStatus] = useState<TaskStatus>(selectedTask.status);

  return (
    <DialogContent className="min-w-[60vw] max-h-[70vh] overflow-y-auto bg-neutral-950 border border-zinc-800 rounded-xl shadow-xl px-6 py-5 custom-scrollbar">
      <DialogTitle className="text-2xl font-semibold text-cyan-500 mb-6 border-b border-zinc-700 pb-2">
        Task Details
      </DialogTitle>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side */}
        <div className="flex-1 space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-zinc-400">Title</label>
            {editMode ? (
              <Input
                className="mt-1 bg-neutral-800 text-white border border-zinc-700"
                value={selectedTask.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            ) : (
              <p className="text-white text-lg font-medium mt-1">
                {selectedTask.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-zinc-400">
              Description
            </label>
            {editMode ? (
              <Textarea
                className="mt-1 bg-neutral-800 text-white border border-zinc-700 min-h-[100px]"
                value={selectedTask.desc}
                onChange={(e) => handleInputChange("desc", e.target.value)}
              />
            ) : (
              <p className="text-zinc-300 mt-1 text-sm leading-relaxed">
                {selectedTask.desc}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-1 block">
              Status
            </label>
            {editMode ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-white flex items-center gap-2 bg-neutral-800 border border-zinc-600"
                  >
                    {editStatus}
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-neutral-900 border border-zinc-700 text-white">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={editStatus}
                    onValueChange={(value) => {
                      setEditStatus(value as TaskStatus);
                      handleInputChange("status", value as TaskStatus);
                    }}
                  >
                    <DropdownMenuRadioItem value="TODO">
                      TODO
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="IN_PROGRESS">
                      IN_PROGRESS
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="DONE">
                      DONE
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="px-3 py-1 text-sm rounded-full bg-zinc-900 text-white border border-zinc-600 inline-block">
                {selectedTask.status}
              </span>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">
              Attachments
            </label>
            <AttachmentSection
              selectedTask={selectedTask}
              projectId={selectedTask.project._id}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[30%] flex flex-col gap-6">
          {/* Assignee */}
          <div className="bg-neutral-900 p-4 rounded-md border border-zinc-700">
            <label className="text-sm font-medium text-zinc-400 mb-2 block">
              Assignee
            </label>
            {editMode ? (
              <Input
                className="bg-neutral-800 text-white"
                value={selectedTask.assignedTo.email}
                onChange={(e) =>
                  handleInputChange("assignedTo", e.target.value)
                }
              />
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={selectedTask.assignedTo.avatar.url}
                  className="w-8 h-8 rounded-full border border-zinc-700"
                />
                <div>
                  <p className="text-white text-sm font-medium">
                    {selectedTask.assignedTo.userName}
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {selectedTask.assignedTo.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reporter */}
          {!editMode && (
            <div className="bg-neutral-900 p-4 rounded-md border border-zinc-700">
              <label className="text-sm font-medium text-zinc-400 mb-2 block">
                Reporter
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={selectedTask.assignedBy.avatar.url}
                  className="w-8 h-8 rounded-full border border-zinc-700"
                />
                <div>
                  <p className="text-white text-sm font-medium">
                    {selectedTask.assignedBy.userName}
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {selectedTask.assignedBy.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <DialogFooter className="mt-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setEditMode((prev) => !prev)}
          className="text-white border border-zinc-700 bg-transparent hover:bg-zinc-800"
        >
          {editMode ? "Cancel Edit" : "Edit"}
        </Button>

        {editMode && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={handleSaveTask}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};
