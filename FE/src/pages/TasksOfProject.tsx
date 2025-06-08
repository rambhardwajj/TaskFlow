import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TasksNavigation } from "../mycomponents/TasksNavigation";
import { KanbanColumn } from "../mycomponents/KanbanColumn";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectTasks,
  TaskStatus,
} from "@/redux/slices/projectsTasksSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { getAllProjects } from "@/redux/slices/projectSlice";

const sections: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function TasksOfProject() {
  const { projectId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { tasksByProject, loading } = useSelector(
    (state: RootState) => state.projectTasks
  );
  const { projects } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectTasks(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(getAllProjects());
    }
  }, [dispatch, projects.length]);

  const currProject = projects.find(
    (project) => project.projectId === projectId
  );
  const tasksBySection = tasksByProject[projectId ?? ""] ?? {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  };
  
  return (
    <div className="flex ">
      <div className=" bg-neutral-950 text-white p-4 overflow-hidden">
        {currProject && <TasksNavigation currProject={currProject} />}
        {loading ? (
          <div className="text-white text-center mt-10">Loading tasks...</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto h-[74vh] overflow-y-hidden pb-4">
            {sections.map((section) => (
              <KanbanColumn
                key={section}
                title={section}
                tasks={tasksBySection[section]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
