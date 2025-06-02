import { Button } from "@/components/ui/button";
import { Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { AvatarDropdown } from "./AvatarDropdown";

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);

  const navLinks: any = [
    // { label: "Dashboard", to: "/" },
    // { label: "Projects", to: "/projects" },
    // { label: "Tasks", to: "/tasks" },
  ];

  return (
    <nav className="w-full bg-black text-white shadow px-2 sm:px-2">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/react.svg" alt="Logo" className="w-6 h-6" />
          <span className="font-semibold hidden sm:inline">InSync</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link: any) => (
            <Link
              key={link.label}
              to={link.to}
              className="hover:text-gray-300 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Sun className="w-5 h-5 hover:text-yellow-400 cursor-pointer transition" />

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
          {!user && (
            <Link to="/login">
              <Button className="cursor-pointer hover:bg-cyan-950">
                Login
              </Button>
            </Link>
          )}
          {!user && (
            <Link to="/signup">
              <Button className="cursor-pointer hover:bg-cyan-950">
                Signup
              </Button>
            </Link>
          )}
          {
            user && (
              <AvatarDropdown/>
            )
          }
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
        </div>
      )}
    </nav>
  );
};

export { Navbar };
