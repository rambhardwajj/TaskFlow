import { Project } from "./ProjectTable";

const TasksNavigation = ({currProject}: {currProject: Project }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">{currProject.name}</h2>
      <div className="flex gap-4">
        <button className="bg-neutral-900 px-4 py-2 rounded hover:bg-zinc-700 transition">
          Filters
        </button>
      </div>
    </header>
  );
};

export  {TasksNavigation};
