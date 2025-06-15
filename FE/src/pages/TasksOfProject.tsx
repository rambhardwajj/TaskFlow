import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasksByProject, loading } = useSelector(
    (state: RootState) => state.projectTasks
  );

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
    <div className="flex min-h-[90vh] min-w-[80vw] relative ">
      <div className=" bg-neutral-900 text-white p-4 overflow-hidden">
        {currProject && <TasksNavigation currProject={currProject} />}
        {/* {loading && (
          <div>Loading</div>
        )} */}

        <div className={`custom-scrollbar flex gap-3 overflow-x-auto h-[74vh] overflow-y-hidden pb-4
          ${loading ? "opacity-50" : ""}
          `}>
          {sections.map((section) => (
            <KanbanColumn
              key={section}
              title={section}
              tasks={tasksBySection[section]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
