import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { AvatarDropdown } from "./AvatarDropdown";
import { getAllProjects } from "@/redux/slices/projectSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const navLinks: any = [
    { label: "Home", to: "/" },
    { label: "Guidelines", to: "/guidelines" },
    // Projects handled separately with dropdown
    { label: "Tasks", to: "/tasks" },
  ];

  return (
    <nav className="w-full bg-black text-white shadow px-2 sm:px-2">
      <div className="mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-white">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-full" />
            <span className="text-xl font-semibold hidden sm:inline font-serif text-cyan-500">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-300">
            {navLinks.map((link: any) => (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Projects Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-zinc-300 hover:text-white cursor-pointer text-sm border-none ">
                  Projects
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-900 text-white border-zinc-800">
                {loading ? (
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : projects.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No projects found
                  </DropdownMenuItem>
                ) : (
                  projects.map((project) => (
                    <DropdownMenuItem
                      key={project.projectId}
                      onClick={() => navigate(`/${project.projectId}`)}
                      className="cursor-pointer text-sm hover:bg-zinc-800"
                    >
                      {project.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-zinc-300 hover:text-white transition"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link to="/login">
                <Button className="cursor-pointer px-4 py-2 text-sm font-medium bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 rounded-lg shadow-sm transition-all duration-200">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className=" cursor-pointer px-4 py-2 text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg shadow-sm transition-all duration-200">
                  Signup
                </Button>
              </Link>
            </>
          ) : (
            <AvatarDropdown />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden flex flex-col items-start gap-4 py-4 px-2 border-t border-zinc-800">
          {navLinks.map((link: any) => (
            <Link
              key={link.label}
              to={link.to}
              className="w-full text-left hover:text-gray-300 transition"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {/* Projects Dropdown (Simple for mobile) */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-zinc-400">Projects</p>
            {projects.map((project) => (
              <Link
                key={project.projectId}
                to={`/${project.projectId}`}
                onClick={() => setIsMobileOpen(false)}
                className="pl-2 text-sm text-zinc-300 hover:text-white"
              >
                {project.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
