import { LayoutDashboard, ListChecks, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-zinc-900 text-white flex flex-col transition-all duration-300 ease-in-out border-r-1 border-zinc-800",
        collapsed ? "w-16" : "w-70"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-xl font-semibold"> Project Manager</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white focus:outline-none"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 mt-4 px-2">
        <a
          href="#"
          className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded"
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>My Projects</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded"
        >
          <ListChecks size={20} />
          {!collapsed && <span>My Tasks</span>}
        </a>
      </nav>
    </div>
  );
}
