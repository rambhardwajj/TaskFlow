import {
  ArrowLeft,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  User,
  MessageCircleQuestion 
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const Sidebar = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(250); // initial width in px
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const minWidth = 10;
  const maxWidth = 300;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setWidth(newWidth);
    };

    const stopResizing = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const user = useSelector((state:RootState)=> state.auth.user )
  console.log("yaha",user)

  return (
   user &&  <div
      ref={sidebarRef}
      style={{ width }}
      className={cn(
        "min-h-[90vh] bg-black text-white flex flex-col justify-between border-r border-zinc-800 transition-all duration-100 ease-linear relative"
      )}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          {width > 80 && (
            <h1 className="text-lg font-semibold text-white tracking-wide">
              TaskFlow
            </h1>
          )}
          <button
            onClick={() => setWidth(width <= 80 ? 250 : 64)}
            className="text-zinc-400 hover:text-white transition"
          >
            {width <= 80 ? <Menu size={20} /> : <ArrowLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2 flex flex-col gap-1">
          {[
            {
              to: "/",
              label: "Home",
              icon: <Home size={20} className="text-cyan-500" />,
            },
            {
              to: "/guidelines",
              label: "Guidelines",
              icon: <MessageCircleQuestion size={20} className="text-cyan-500"/>,
            },
            {
              to: "/tasks",
              label: "My Tasks",
              icon: <ListChecks size={20} className="text-cyan-500" />,
            },
            {
              to: "/projects",
              label: "My Projects",
              icon: <LayoutDashboard size={20} className="text-cyan-500" />,
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-zinc-800 transition group"
            >
              {item.icon}
              {width > 80 && (
                <span className="text-zinc-200 group-hover:text-white transition">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
     {user && <div className="p-4 border-t border-zinc-800">
        <Link
          to="/me"
          className={cn(
            "flex items-center justify-center py-2  rounded-md transition group",
            width <= 80
              ? "hover:bg-zinc-800"
              : "bg-cyan-800 hover:bg-cyan-700 text-white"
          )}
        >
          {  width > 150 ? (
            <span className="text-sm font-medium"><User /></span>
          ) : (
           <img
              src={user.avatar.url}
              alt="https://api.dicebear.com/7.x/initials/svg?seed=RamB"
              className="w-7 h-7 rounded-full object-cover border border-white"
            />
          )}
        </Link>
      </div>}

      {/* Resize Handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-zinc-800 hover:bg-zinc-600 transition"
      />
    </div>
  );
};

export { Sidebar };
