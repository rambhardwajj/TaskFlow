import { FC, useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";

import {
  fetchProjectTasks,
  Task,
  TaskStatus,
} from "@/redux/slices/projectsTasksSlice";
import { Dialog } from "@/components/ui/dialog";

import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { NewTaskDialog } from "./NewTaskDialog";
import {
  fetchUserTasks,
  updateTaskStatus,
} from "@/redux/slices/userTasksSlice";
import { EditTaskDialogbox } from "./Edit_TaskCard";
import {API_BASE_URL} from "../../config"


interface KanbanColumnProps {
  title: TaskStatus;
  tasks: Task[];
}

const KanbanColumn: FC<KanbanColumnProps> = ({ title, tasks }) => {
  const { projectId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { byId, userTasks, loading, error } = useSelector(
    (state: RootState) => state.userTasks
  );
  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);
  // console.log(projectId);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newTaskOpen, setOpenNewTask] = useState<boolean>(false);
  const [added, setAdded] = useState(false);

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setEditMode(false);
  };
  const handleInputChange = (field: keyof Task, value: any) => {
    if (!selectedTask) return;
    if (field === "assignedTo") {
      value = {
        userName: selectedTask.assignedTo.userName,
        avatar: selectedTask.assignedTo.avatar,
        email: value,
      };
    }
    setSelectedTask({ ...selectedTask, [field]: value });
  };

  const handleSaveTask = async () => {
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
        `${API_BASE_URL}/api/v1/task/project/${projectId}/update/tasks/${taskId}`,
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
      dispatch(fetchUserTasks());

      if (res.data) {
        toast.success("Task updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    } finally {
      setSelectedTask(null);
      if (projectId) dispatch(fetchProjectTasks(projectId));
      dispatch(fetchUserTasks());
    }
  };

  const handleNewTaskSubmit = async (formData: FormData) => {
    console.log(formData);
    await addTask(formData);
  };
  const addTask = async (formData: FormData) => {
    try {
      console.log("in addTask");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/task/project/${projectId}/create/tasks`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAdded(!added);
      if (res.data) {
        toast.success("Task created successfully");
        setOpenNewTask(false);
      }
      if (projectId) {
        dispatch(fetchProjectTasks(projectId));
        dispatch(fetchUserTasks());
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    }
  };

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    console.log("drg strt");
    setDraggedTaskId(taskId); // Store the ID of the task being dragged
    e.dataTransfer.setData("text/plain", taskId); // Set data for the drop event
    e.dataTransfer.effectAllowed = "move"; // Indicate a 'move' operation
  }, []);
  const handleDragEnd = useCallback(() => {
    console.log("drg end");

    setDraggedTaskId(null);
    setDragOverStatus(null);
  }, []);

  const handleDragOverColumn = useCallback((e: React.DragEvent) => {
    console.log("drg over");
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  const handleDragEnterColumn = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      console.log("drg enter");
      e.preventDefault();
      setDragOverStatus(status);
    },
    []
  );
  const handleDragLeaveColumn = useCallback((e: React.DragEvent) => {
    console.log("drg leave");
    setDragOverStatus(null);
  }, []);

  const handleDropColumn = useCallback(
    async (e: React.DragEvent, targetStatus: TaskStatus) => {
      console.log("drg drop,- ", targetStatus);
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain");

      if (taskId) {
        const task = byId[taskId];
        // console.log("target status " , task)
        console.log(task);
        if (!task) {
          toast.error("You are not a part of this task.");
        }

        if (task && task.status !== targetStatus) {
          console.log("hi");
          try {
            dispatch(fetchUserTasks());
            await dispatch(
              updateTaskStatus({
                taskId,
                newStatus: targetStatus,
              })
            );
            if (projectId) {
              await dispatch(fetchProjectTasks(projectId)); // <- Important
            }
          } catch (err) {
            console.error("Failed to update task status:", err);
            toast.error(
              `Failed to update task status: ${
                err instanceof Error ? err.message : String(err)
              }`
            );
          } finally {
            dispatch(fetchUserTasks());
          }
        }
      }
      // Always reset states after a drop attempt
      setDraggedTaskId(null);
      setDragOverStatus(null);
    },
    [tasks, dispatch, projectId]
  );

  return (
    <div
      className={`min-w-[200px] w-[80vw]  sm:min-w-[300px] bg-neutral-800 mr-1 p-4 rounded-md shadow-lg flex flex-col gap-4 transition hover:scale-[1.003]
        ${
          dragOverStatus === title
            ? " border-2 border-solid border-blue-500 bg-neutral-700"
            : "border-2 border-transparent"
        }`}
      onDragOver={handleDragOverColumn}
      onDragEnter={(e) => handleDragEnterColumn(e, title)}
      onDragLeave={handleDragLeaveColumn}
      onDrop={(e) => handleDropColumn(e, title)}
    >
      <div className="flex justify-between items-center pb-2 border-b-[1px] border-neutral-600">
        <div className="font-semibold text-sm">{title}</div>
        {title === "TODO" && projectId && (
          <div>
            <button
              onClick={() => setOpenNewTask(true)}
              className="text-xs cursor-pointer hover:scale-[1.1] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
            >
              <Plus size={14} /> Add task
            </button>

            <NewTaskDialog
              open={newTaskOpen}
              onOpenChange={setOpenNewTask}
              onSubmit={handleNewTaskSubmit}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(80vh-100px)] pr-2 ">
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => handleCardClick(task)}
            draggable
            onDragStart={(e) => handleDragStart(e, task._id)}
            onDragEnd={handleDragEnd}
            className={`
                        cursor-grab active:cursor-grabbing 
                        transition-opacity duration-200 
                        select-none 
                        ${draggedTaskId === task._id ? "opacity-40 " : ""}
                      `}
          >
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
        <EditTaskDialogbox
          loading
          selectedTask={selectedTask}
          editMode={editMode}
          handleInputChange={handleInputChange}
          handleSaveTask={handleSaveTask}
          setEditMode={setEditMode}
        />
      </Dialog>
    </div>
  );
};

export { KanbanColumn };
