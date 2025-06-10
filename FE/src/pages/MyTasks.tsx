import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks } from "@/redux/slices/userTasksSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { TaskStatus } from "@/redux/slices/projectsTasksSlice";
import {TaskCard} from "../mycomponents/TaskCard"

const sections: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const MyTasks = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userTasks, byId, loading, error } = useSelector(
    (state: RootState) => state.userTasks
  );

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-white text-2xl font-semibold mb-6">My Tasks</h1>

      {loading ? (
        <p className="text-zinc-300">Loading tasks...</p>
      ) : error ? (
        <p className="text-red-400">Error: {error}</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto">
          {sections.map((status) => (
            <div
              key={status}
              className="min-w-[29vw] bg-neutral-800 rounded-lg p-4 shadow-lg flex flex-col gap-3"
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                {status.replace("_", " ")}
              </h2>
              <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2">
                {userTasks[status].map((taskId) => (
                  /* @ts-ignore */
                  <TaskCard key={taskId} {...byId[taskId]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
