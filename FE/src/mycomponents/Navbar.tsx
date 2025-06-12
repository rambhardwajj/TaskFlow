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
  // console.log(user);

  const navLinks: any = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "Tasks", to: "/tasks" },
  ];

  return (
    <nav className="w-full bg-black text-white shadow px-2 sm:px-2">
      <div className=" mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-white">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-[50%]" />
            <span className="text-xl font-semibold hidden sm:inline font-serif text-cyan-500">TaskFlow</span>
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
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Sun className="w-5 h-5 hover:text-yellow-400 text-zinc-300 cursor-pointer transition-colors duration-200" />

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
                <Button className="px-4 py-2 text-sm font-medium bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 rounded-lg shadow-sm transition-all duration-200">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg shadow-sm transition-all duration-200">
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
        </div>
      )}
    </nav>
  );
};

export { Navbar };
