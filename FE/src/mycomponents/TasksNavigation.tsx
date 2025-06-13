import { Project } from "./ProjectTable";

const TasksNavigation = ({currProject}: {currProject: Project }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">{currProject.name}</h2>
      
    </header>
  );
};

export  {TasksNavigation};
