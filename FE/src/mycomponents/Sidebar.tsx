import { ArrowLeft, Divide, LayoutDashboard, ListChecks, Menu, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={cn(
        "min-h-[90vh] bg-black text-white flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-zinc-800",
        collapsed ? "w-16" : "w-70"
      )}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h1 className="text-xl font-semibold">Project Manager</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white focus:outline-none"
          >
           {collapsed ? <Menu className="hover:cursor-pointer" size={20} />: <ArrowLeft className="hover:cursor-pointer" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 mt-4 px-2">
          <Link
            to="/projects"
            className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded"
          >
            <LayoutDashboard size={20} />
            {!collapsed && <span>My Projects</span>}
          </Link>
          <Link
            to="/tasks"
            className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded"
          >
            <ListChecks size={20} />
            {!collapsed && <span>My Tasks</span>}
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4  border-t border-zinc-800">
        <Link
        to='/me'
          className="flex cursor-pointer items-center  bg-cyan-800 hover:bg-cyan-600 text-white py-2  rounded w-full justify-center transition"
        >
         
          {!collapsed ? <span>Profile</span>: <img src="/me.jpg" alt="Logo" className="  w-6 h-6 rounded-xl" />}
        </Link>
      </div>
    </div>
  );
}

export {Sidebar}