import { KanbanColumn } from "@/mycomponents/KanbanColumn";
import { Link } from "react-router-dom";
import FooterComponent from "@/mycomponents/FooterComponente";
import { FAQ } from "@/mycomponents/FAQ";
import Features from "@/mycomponents/Features";

export default function Home() {
  return (
    <main className="bg-zinc-950 text-white min-h-screen px-6 md:px-16 py-10">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-block bg-zinc-800 px-4 py-1 text-xs text-zinc-300 rounded-full shadow-sm">
          Built for seamless project execution 🔵
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          Organize work.{" "}
          <span className="text-cyan-500">Streamline tasks.</span>
          <br />
          Deliver projects efficiently.
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto mb-6">
          Manage your teams, tasks, and deadlines—all in one place. Your
          productivity hub for focused execution, real-time collaboration, and
          project success.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to={"/guidelines"}>
            <button className=" cursor-pointer bg-cyan-600 hover:bg-cyan-700 transition text-white px-6 py-2 rounded-md text-sm font-medium">
              Get Started
            </button>
          </Link>
          <button
            onClick={() => {
              document
                .getElementById("demo-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className=" cursor-pointer border border-zinc-600 hover:bg-zinc-800 transition text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Live Demo
          </button>
        </div>
      </section>

      {/* PMS Preview Box */}
      <section
        id="demo-section"
        className="bg-zinc-900/40 border border-zinc-700 rounded-md p-6 max-w-6xl mx-auto shadow-md mb-20"
      >
        <h2 className="text-sm font-semibold text-zinc-400 mb-4">
          Dashboard Preview
        </h2>
        <div className="bg-zinc-900/80 rounded-md p-4 text-sm text-zinc-300 overflow-x-auto">
          <div className="flex ">
            <KanbanColumn
              title="TODO"
              tasks={[
                {
                  _id: "task-101",
                  title: "Set up project repo",
                  desc: "Initialize GitHub repo with README and project structure",
                  updatedAt: "2025-06-10T14:00:00Z",
                  status: "TODO",
                  assignedTo: {
                    userName: "Ram Bhardwaj",
                    email: "ram@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=RamB",
                  },
                  assignedBy: {
                    userName: "Anita Sharma",
                    email: "anita@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=AnitaS",
                  },
                },
                {
                  _id: "task-102",
                  title: "Set up Tasks repo",
                  desc: "Initialize GitHub repo with README and project structure",
                  updatedAt: "2025-06-10T14:00:00Z",
                  status: "TODO",
                  assignedTo: {
                    userName: "Ram Bhardwaj",
                    email: "ram@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=RamB",
                  },
                  assignedBy: {
                    userName: "Anita Sharma",
                    email: "anita@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=AnitaS",
                  },
                },
              ]}
            />

            <KanbanColumn
              title="IN_PROGRESS"
              tasks={[
                {
                  _id: "task-102",
                  title: "Build login functionality",
                  desc: "Implement login with JWT, form validation, and error handling",
                  updatedAt: "2025-06-11T09:30:00Z",
                  status: "IN_PROGRESS",
                  assignedTo: {
                    userName: "Ram Bhardwaj",
                    email: "ram@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=RamB",
                  },
                  assignedBy: {
                    userName: "Anita Sharma",
                    email: "anita@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=AnitaS",
                  },
                },
              ]}
            />

            <KanbanColumn
              title="DONE"
              tasks={[
                {
                  _id: "task-103",
                  title: "Design UI mockups",
                  desc: "Created UI wireframes for dashboard and sidebar using Figma",
                  updatedAt: "2025-06-09T17:45:00Z",
                  status: "DONE",
                  assignedTo: {
                    userName: "Ram Bhardwaj",
                    email: "ram@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=RamB",
                  },
                  assignedBy: {
                    userName: "Anita Sharma",
                    email: "anita@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/initials/svg?seed=AnitaS",
                  },
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* What is PMS Section */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
        <div>
          <h2 className="text-xl font-bold mb-3">
            What is <span className="text-cyan-500">TaskFlow</span>?
          </h2>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            TaskFlow is your project management ally—built to simplify team
            coordination, progress tracking, and productivity. From planning
            features to delivering milestones, TaskFlow empowers you with
            intuitive tools, clean UI, and seamless workflows.
          </p>
          <p className="text-zinc-400 text-sm">
            Whether you're a startup founder, developer, or project lead,
            TaskFlow helps you bring clarity to chaos and get work done—on time,
            every time.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <img
            src="logo.png"
            width={300}
            alt="Logo"
            className="animate-pulse transition-transform duration-300 hover:rotate-6"
          />
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto mt-40 px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            Key Features of {" "}
            <span className="bg-gradient-to-r from-cyan-800 via-blue-500 to-cyan-800 text-transparent bg-clip-text">
              Task Flow
            </span>
          </h2>

          <Features />
        </div>
      </section>

      <section className="flex mt-20 justify-center border-t border-neutral-800 ">
        <FAQ />
      </section>

      <FooterComponent />
    </main>
  );
}
