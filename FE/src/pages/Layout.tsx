// src/components/Layout.tsx
import { Navbar } from "../mycomponents/Navbar";
import { Sidebar } from "../mycomponents/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
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
