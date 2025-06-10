import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTasks,
  myTask,
  updateTaskStatus,
} from "@/redux/slices/userTasksSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { TaskStatus } from "@/redux/slices/userTasksSlice";
import { MyTaskCard } from "../mycomponents/MyTaskCard";

const taskSections: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const statusToLabel: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const MyTasks = () => {
  const [selectedTask, setSelectedTask] = useState<myTask | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { byId, userTasks, loading, error } = useSelector(
    (state: RootState) => state.userTasks
  );
  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  // State to track the ID of the task currently being dragged
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  // State to track which column (TaskStatus) the user is currently dragging over
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId); // Store the ID of the task being dragged
    e.dataTransfer.setData("text/plain", taskId); // Set data for the drop event
    e.dataTransfer.effectAllowed = "move"; // Indicate a 'move' operation
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverStatus(null);
  }, []);

  const handleDragOverColumn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnterColumn = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      setDragOverStatus(status);
    },
    []
  );

  const handleDragLeaveColumn = useCallback((e: React.DragEvent) => {
    setDragOverStatus(null); // Clear the drag over status
  }, []);

  const handleDropColumn = useCallback(
    async (e: React.DragEvent, targetStatus: TaskStatus) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain"); // Get the task ID from dataTransfer

      if (taskId) {
        const task = byId[taskId]; // Get the task details from Redux state

        // Only dispatch update if the task's status is actually changing
        if (task && task.status !== targetStatus) {
          try {
            // Dispatch the async thunk to update task status
            await dispatch(
              updateTaskStatus({
                taskId,
                newStatus: targetStatus,
              })
            );
          } catch (err) {
            console.error("Failed to update task status:", err);
            alert(
              `Failed to update task status: ${
                err instanceof Error ? err.message : String(err)
              }`
            );
          }
        }
      }
      // Always reset states after a drop attempt
      setDraggedTaskId(null);
      setDragOverStatus(null);
    },
    [byId, dispatch]
  );

  return (
    <div className="p-6 bg-zinc-900 h-[90vh] custom-scrollbar ">
      {" "}
      {/* Added bg and min-h-screen for better visual */}
      <h1 className="text-white text-sm font-bold mb-8 text-left">
        My Tasks Dashboard
      </h1>
      {loading ? (
        <p className="text-zinc-300 text-center text-lg">Loading tasks...</p>
      ) : error ? (
        <p className="text-red-400 text-center text-lg">Error: {error}</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto justify-start custom-scrollbar min-h-[78vh]">
          {taskSections.map((status) => (
            <div
              key={status}
              // Conditional styling for drop target feedback
              className={`
                min-w-[280px] w-[calc(33.33%-16px)] max-w-[30vw] 
                bg-neutral-800 p-3 rounded-sm shadow-lg 
                flex flex-col gap-4 transition-all duration-200 
                ${
                  dragOverStatus === status
                    ? " border-2 border-solid border-blue-500 bg-neutral-700"
                    : "border-2 border-transparent"
                }
              `}
              onDragOver={handleDragOverColumn}
              onDragEnter={(e) => handleDragEnterColumn(e, status)}
              onDragLeave={handleDragLeaveColumn}
              onDrop={(e) => handleDropColumn(e, status)}
            >
              <h2 className="text-white font-bold text-sm border-b border-zinc-700 pb-2 mb-2">
                {statusToLabel[status]} ({userTasks[status].length})
              </h2>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
                {userTasks[status].length === 0 ? (
                  <p className="text-zinc-400 text-sm italic py-4 text-center">
                    No tasks in this section.
                  </p>
                ) : (
                  userTasks[status].map((id) => (
                    <div
                      key={id}
                      draggable // drag true
                      onDragStart={(e) => handleDragStart(e, id)}
                      onDragEnd={handleDragEnd}
                      className={`
                        cursor-grab active:cursor-grabbing 
                        transition-opacity duration-200 
                        select-none 
                        ${draggedTaskId === id ? "opacity-40 " : ""}
                      `}
                    >
                      <MyTaskCard {...byId[id]} />
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
