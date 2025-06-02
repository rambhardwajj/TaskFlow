import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store/store";
import { useNavigate } from "react-router-dom";

export const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>
        <img
          src={user.avatar?.url || "/me.jpg"}
          alt="avatar"
          className="cursor-pointer rounded-full w-8 h-8 object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-24 bg-neutral-900 border border-zinc-700 text-white rounded-md shadow-lg z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-cyan-800 hover:rounded-t-md "
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-red-800 hover:rounded-b-md "
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
