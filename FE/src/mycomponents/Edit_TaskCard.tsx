import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Update this path based on your project structure
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskStatus } from "@/redux/slices/projectsTasksSlice";
import { DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Plus } from "lucide-react";
// import { AttachmentSection } from "./Attachments";
import { useParams } from "react-router-dom";
import { AttachmentSection } from "./Attachments";
import { DialogTitle } from "@radix-ui/react-dialog";

interface EditTaskDialogProps {
  loading: boolean;
  selectedTask: Task | null;
  editMode: boolean;
  handleInputChange: (field: keyof Task, value: string) => void;
  handleSaveTask: () => void;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditTaskDialogbox: React.FC<EditTaskDialogProps> = ({
  loading,
  selectedTask,
  editMode,
  handleInputChange,
  handleSaveTask,
  setEditMode,
}) => {
  if (!selectedTask) return;
  const {projectId} = useParams()
  if(!projectId) return ;
  const [editStatus, setEditStatus] = useState(selectedTask.status);

  return (
    <DialogContent className="custom-scrollbar min-w-[60vw] bg-black border border-[#333] mx-auto rounded-lg shadow-2xl p-6 space-y-1 max-h-[67vh] overflow-y-auto">
      <div className="flex border-b border-zinc-700 text-sm font-medium text-zinc-400">
        <button className="text-white border-b-2 border-blue-600 pb-1">
         <DialogTitle>General</DialogTitle> 
        </button>
      </div>

      {selectedTask && (
        <div className="flex gap-4 justify-between">
          <div className="w-full min-w-[30vw] justify-between space-y-3">
            <div className="space-y-2">
              <h2 className="text-cyan-600 text-2xl font-semibold tracking-tight">
                {editMode ? (
                  <div>
                    Edit Task
                    <Textarea
                      className="mt-2 bg-neutral-800 border  text-white focus:ring-2 focus:ring-blue-600 rounded-lg min-h-[30px]"
                      value={selectedTask.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  `${selectedTask.title}`
                )}
              </h2>
              {!editMode && (
                <p className="text-zinc-400 text-sm">
                  Comprehensive view of your selected task
                </p>
              )}
            </div>

            <div className="space-y-2 bg-black/50 border border-[#444] rounded-md p-4">
              <h3 className="text-cyan-600 font-semibold text-base ">
                Description
              </h3>
              {editMode ? (
                <Textarea
                  className="bg-neutral-800 border  text-white focus:ring-2 focus:ring-blue-600 rounded-lg min-h-[100px]"
                  value={selectedTask.desc}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                />
              ) : (
                <ul className="list-disc pl-5 text-zinc-300 text-sm space-y-1">
                  <li>{selectedTask.desc}</li>
                </ul>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-zinc-400">
                Status
              </label>
              {editMode ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="cursor-pointer hover:scale-[1.1]">
                      {editStatus}{" "}
                      <Edit className="hover:scale-[1.1] text-green-500" />{" "}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Task Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={editStatus}
                      onValueChange={(value) => {
                        // @ts-ignore
                        setEditStatus(value);
                        handleInputChange("status", value);
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
                <p className="inline-block px-3 py-1 text-sm rounded-full bg-neutral-800 text-white border border-zinc-600">
                  {selectedTask.status}
                </p>
              )}
            </div>

            {/* Attachments  */}
            <div>
              <label className="text-neutral-500 text-sm font-semibold mb-3">Attachments</label>
              <AttachmentSection
              selectedTask={selectedTask}
              projectId={projectId} />
            </div>
          </div>

          <div className="flex flex-col max-w-[30vw] gap-6">
            <div className="bg-neutral-950 rounded-md p-1 pl-3 pb-2 w-full min-w-[15vw] border border-[#444]">
              <h4 className="text-zinc-400 text-xs mb-1">Assignee</h4>
              {editMode ? (
                <div>
                  <Input
                    className="bg-neutral-800 text-white"
                    value={selectedTask.assignedTo.email}
                    onChange={(e) =>
                      handleInputChange("assignedTo", e.target.value)
                    }
                  />
                </div>
              ) : (
                <p className="text-white text-sm font-medium">
                  {selectedTask.assignedTo.email}
                </p>
              )}
              {!editMode && (
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={selectedTask.assignedTo.avatar}
                    className="w-8 h-8 rounded-full border border-zinc-700"
                  />
                  <p className="text-white text-sm font-medium">
                    {selectedTask.assignedTo.userName}
                  </p>
                </div>
              )}
            </div>

            {!editMode && (
              <div className="bg-neutral-950 rounded-md p-1 pl-3 pb-2 w-full border border-[#444]">
                <h4 className="text-zinc-400 text-xs mb-1">Reporter</h4>
                <p className="text-white text-sm font-medium">
                  {selectedTask.assignedBy.email}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={selectedTask.assignedBy.avatar}
                    className="w-8 h-8 rounded-full border border-zinc-700"
                  />
                  <p className="text-white text-sm font-medium">
                    {selectedTask.assignedBy.userName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <DialogFooter className="mt-[-50px] flex flex-col-reverse sm:flex-row justify-between gap-4">
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
    </DialogContent>
  );
};
