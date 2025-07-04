import {
  Boxes,
  Bot,

  LayoutDashboard,
} from "lucide-react";
// import FeatureDash from './FeatureDash';

const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4   items-start">
      
       <div className="bg-neutral-900/10 relative min-h-[50vh] border border-neutral-800 rounded-md px-6 py-2 hover:shadow-md hover:shadow-neutral-500/40 col-span-2 row-span-2">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-lg font-semibold mb-10 flex gap-2 justify-between text-white">
          <span className="text-zinc-100 text-md ">
            Drag and Drop Kanban Board
          </span>
          <LayoutDashboard size={24} className="mt-1 text-cyan-500" />
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed tracking-wide">
          Effortlessly manage your tasks with intuitive{" "}
          <span className="text-white font-medium">drag-and-drop</span> support
          across the Kanban board. Users can move tasks between columns like{" "}
          <span className="text-cyan-400 font-semibold">To Do</span>,{" "}
          <span className="text-yellow-400 font-semibold">In Progress</span>,
          and <span className="text-green-400 font-semibold">Done</span> to
          reflect their current status — streamlining team collaboration and
          boosting productivity.
        </p>
        <br />
        <p className="text-sm text-gray-400 leading-relaxed tracking-wide">
          Seperate Kanban Boards for tracking all of your Tasks and tasks based
          on Projects.
        </p>
        <br />
      </div>
      
      
      <div className="bg-neutral-900/10 relative min-h-[50vh]  border border-neutral-800 rounded-md px-6 py-3 hover:shadow-md hover:shadow-neutral-500/40 col-span-2 row-span-1">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-lg font-semibold mb-10 justify-between flex gap-2 text-white">
          <span className="text-zinc-100 text-md">
            Role-Based Access Control
          </span>
          <Boxes size={24} className="mt-1 text-[#f97316]" />
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed tracking-wide">
          Users in a project are assigned roles with clearly defined
          permissions:
          <span className="block">
            <strong className="text-white">Owner</strong> – Full control over
            project, members, tasks, subtasks, and notes.
          </span>
          <span className="block">
            <strong className="text-white">Project Admin</strong> – Can manage
            tasks, members, and project settings (except creation).
          </span>
          <span className="block">
            <strong className="text-white">Member</strong> – Can view the
            project, manage their assigned tasks, subtasks, and notes.
          </span>
          RBAC ensures secure, permission-based collaboration across teams.
        </p>
      </div>

     
      <div className="bg-neutral-900/10 relative border min-h-[50vh]  border-neutral-800 rounded-md px-6 py-3 hover:shadow-md hover:shadow-neutral-500/40 col-span-2 row-span-2">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <h3 className="text-md font-semibold mb-3 flex justify-between  text-white">
          <span className="text-zinc-100 text-md">
            Role Based CRUD operations on all the Components - Projects, Tasks,
            SubTasks{" "}
          </span>
          <Bot size={59} className=" text-[#a855f7]" />
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed tracking-wide">
          Every user action in the platform is governed by their assigned role,
          ensuring secure and organized collaboration.
          <br />
          <br />
          Depending on their role —{" "}
          <span className="text-white font-medium">Owner</span>,{" "}
          <span className="text-white font-medium">Project Admin</span>, or{" "}
          <span className="text-white font-medium">Member</span> — users get
          access to create, read, update, or delete entities like{" "}
          <span className="text-cyan-400 font-semibold">Projects</span>,{" "}
          <span className="text-yellow-400 font-semibold">Tasks</span>, and{" "}
          <span className="text-pink-400 font-semibold">SubTasks</span>.
          <br />
          <br />
          <br />
        </p>
      </div>
    </div>
  );
};

export default Features;
