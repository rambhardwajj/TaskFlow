// src/components/Layout.tsx
import { useEffect } from "react";
import { Navbar } from "../mycomponents/Navbar";
import { Sidebar } from "../mycomponents/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { getUser } from "@/redux/slices/authSlice";

const Layout = () => {

  const dispatch = useDispatch<AppDispatch>()

  useEffect( () => {
    dispatch(getUser())
  }, [dispatch])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar />

      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-zinc-950 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { Layout };
