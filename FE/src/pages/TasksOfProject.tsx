import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TasksNavigation } from "../mycomponents/TasksNavigation";
import { KanbanColumn } from "../mycomponents/KanbanColumn";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectTasks, TaskStatus } from "@/redux/slices/projectsTasksSlice";
import { AppDispatch, RootState } from "@/redux/store/store";


const sections: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function TasksOfProject() {
  const { projectId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { tasksByProject, loading } = useSelector(
    (state: RootState) => state.projectTasks
  );

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectTasks(projectId));
    }
  }, [dispatch, projectId]);

 

  const tasksBySection = tasksByProject[projectId ?? ""] ?? {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  };

  return (
    <div className="flex">
      <div className="w-full bg-neutral-950 text-white p-4 overflow-hidden">
        <TasksNavigation />
        {loading ? (
          <div className="text-white text-center mt-10">Loading tasks...</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto h-[74vh] overflow-y-hidden pb-4">
            {sections.map((section) => (
              <KanbanColumn
                key={section}
                title={section}
                tasks={tasksBySection[section]}
                onAddTask={() => console.log(`Add task to ${section}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
