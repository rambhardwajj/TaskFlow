import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Guidelines() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 text-neutral-100 scroll-smooth">
      <h1 className="text-3xl font-bold text-left border-b border-neutral-700 pb-2 text-white">
        Taskflow User Guidelines
      </h1>

      {/* ✅ Table of Contents */}
      <nav className="  text-sm space-y-2">
        <h2 className="text-lg font-semibold text-cyan-400 mb-2">
          📌 Contents
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-neutral-300">
          <li><a href="#create-project" className="hover:underline text-blue-400">1. How to Create a Project</a></li>
          <li><a href="#add-task" className="hover:underline text-blue-400">2. How to Add a Task</a></li>
          <li><a href="#add-member" className="hover:underline text-blue-400">3. How to Add a Member</a></li>
          <li><a href="#roles" className="hover:underline text-blue-400">4. Understanding Roles & Permissions</a></li>
          <li><a href="#change-password" className="hover:underline text-blue-400">5. How to Change Your Password</a></li>
        </ul>
      </nav>

      {/* === Sections Below === */}

      <section
        id="create-project"
        className="bg-neutral-900 border border-cyan-700 p-8 rounded-md shadow-md transition hover:border-cyan-500"
      >
        <h2 className="text-2xl text-amber-500 font-semibold mb-4">
          1️⃣ How to Create a Project —{" "}
          <Link className="text-blue-500 underline" to="/projects">
            Create Projects
          </Link>
        </h2>
        <ul className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
          <li>Navigate to the <strong>My Projects</strong> section.</li>
          <li>
            Click the <span className="text-green-400 font-bold">➕</span> icon to open the Project Creation panel.
          </li>
          <li>
            Enter project <strong>title</strong>, <strong>description</strong>, and optionally add members.
          </li>
          <li>Click <strong>Create</strong> to finalize the project.</li>
        </ul>
        <img src="/guide/createProject.png" alt="Create Project" className="rounded-md mt-6 border border-neutral-700" />
      </section>

      <section id="add-task" className="bg-neutral-900 border border-cyan-700 p-8 rounded-md shadow-md transition hover:border-cyan-500">
        <h2 className="text-2xl text-amber-500 font-semibold mb-4">2️⃣ How to Add a Task</h2>
        <ul className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
          <li>From <strong>My Projects</strong>, select your project.</li>
          <li>Click the <strong>project title</strong> to go to the Kanban board.</li>
          <li>
            Under the <strong>TODO</strong> column, click <span className="text-amber-400 font-medium">+ Add Task</span>.
          </li>
          <li>Fill in task details and click <strong>Create</strong>.</li>
        </ul>
        <div className="space-y-4 mt-6">
          <img src="/guide/clickProject.png" className="rounded-md border border-neutral-700" />
          <img src="/guide/addTask.png" className="rounded-md border border-neutral-700" />
          <img src="/guide/addDetails.png" className="rounded-md border border-neutral-700" />
        </div>
      </section>

      <section id="add-member" className="bg-neutral-900 border border-cyan-700 p-8 rounded-md shadow-md transition hover:border-cyan-500">
        <h2 className="text-2xl text-amber-500 font-semibold mb-4">3️⃣ How to Add a Member</h2>
        <ul className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
          <li>Go to <strong>My Projects</strong> and click the <span className="text-green-400">project icon</span>.</li>
          <li>Navigate to the <strong>Members</strong> section.</li>
          <li>
            Click the <Plus className="inline w-4 h-4 text-amber-400" /> icon to open the Add Member form.
          </li>
          <li>Enter the member’s email and assign a role.</li>
        </ul>
        <div className="space-y-4 mt-6">
          <img src="/guide/ProjectDetIcon.png" className="rounded-md border border-neutral-700" />
          <img src="/guide/ProjectPlus.png" className="rounded-md border border-neutral-700" />
          <img src="/guide/member.png" className="rounded-md border border-neutral-700" />
        </div>
      </section>

      <section id="roles" className="bg-neutral-900 border border-cyan-700 p-8 rounded-md shadow-md transition hover:border-cyan-500">
        <h2 className="text-2xl text-amber-500 font-semibold mb-4">4️⃣ Understanding Roles & Permissions</h2>
        <p className="mb-4 text-sm">There are three roles with varying permissions:</p>
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <strong>🔑 Owner</strong>
            <ul className="list-disc pl-6">
              <li>Full project management: create, edit, delete.</li>
              <li>Can manage all tasks, members, subtasks, and notes.</li>
            </ul>
          </div>
          <div>
            <strong>🛠️ Project Admin</strong>
            <ul className="list-disc pl-6">
              <li>Edit/delete project (not create).</li>
              <li>Can manage tasks, subtasks, members, and notes.</li>
            </ul>
          </div>
          <div>
            <strong>👤 Member</strong>
            <ul className="list-disc pl-6">
              <li>Can only view projects and manage their own tasks.</li>
              <li>Manage their own subtasks and notes.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="change-password" className="bg-neutral-900 border border-cyan-700 p-8 rounded-md shadow-md transition hover:border-cyan-500">
        <h2 className="text-2xl text-amber-500 font-semibold mb-4">5️⃣ How to Change Your Password</h2>
        <ul className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
          <li>Go to your <strong>Profile Settings</strong>.</li>
          <li>Click on the <strong>Security</strong> tab.</li>
          <li>Enter your <strong>current password</strong> and a <strong>new password</strong>.</li>
          <li>Click <strong>Update</strong> to save changes.</li>
        </ul>
        <img src="/guide/updatepass.png" alt="Change Password Screenshot" className="rounded-md mt-6 border border-neutral-700" />
      </section>
    </div>
  );
}
