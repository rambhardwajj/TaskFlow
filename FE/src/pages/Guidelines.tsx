import { Plus } from "lucide-react";

export default function Guidelines() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 text-neutral-200">
      <h1 className="text-3xl font-bold text-left border-b border-neutral-700 text-white">
        Taskflow User Guidelines
      </h1>

      {/* 1. Create Project */}
      <section className="border border-cyan-700 p-10 rounded-sm">
        <div>
          <h2 className="text-xl font-semibold mb-3">
            1️⃣ How to Create a Project
          </h2>
          <ul className="list-decimal pl-6 space-y-1 text-xs">
            <li>
              Navigate to the <strong>My Projects</strong> section.
            </li>
            <li>
              Click the <span className="text-green-500 font-bold">➕</span>{" "}
              icon to open the Project Creation panel.
            </li>
            <li>
              Enter project <strong>title</strong>, <strong>description</strong>
              , and optionally add members.
            </li>
            <li>
              Click <strong>Create</strong> to finalize the project.
            </li>
          </ul>
        </div>
        <img
          src="/guide/createProject.png"
          alt="Create Project Screenshot"
          className="rounded-md  mt-4"
        />
      </section>

      {/* 2. Add Task */}
      <section className="border border-cyan-700 p-6 rounded-sm">
        <h2 className="text-xl font-semibold mb-3">2️⃣ How to Add a Task</h2>
        <ul className="list-decimal pl-6 space-y-1 text-xs">
          <li>
            From <strong>My Projects</strong>, select your project.
          </li>
          <li>
            Click the <strong>project title</strong> to go to the Kanban board.
          </li>
          <li>
            Under the <strong>TODO</strong> column, click{" "}
            <span className="text-amber-500">+ Add Task</span>.
          </li>
          <li>
            Fill in task details and click <strong>Create</strong>.
          </li>
        </ul>
        <img
          src="/guide/clickProject.png"
          alt="Add Task Screenshot"
          className="rounded-md  mt-4"
        />
        <img
          src="/guide/addTask.png"
          alt="Add Task Screenshot"
          className="rounded-md  mt-4"
        />
        <img
          src="/guide/addDetails.png"
          alt="Add Task Screenshot"
          className="rounded-md  mt-4"
        />
      </section>

      {/* 3. Add Members */}
      <section className="border border-cyan-700 p-6 rounded-sm">
        <h2 className="text-xl font-semibold mb-3">3️⃣ How to Add a Member</h2>
        <ul className="list-decimal pl-6 space-y-1 text-sm ">
          <li>
            Go to <strong>My Projects</strong> and click the{" "}
            <span className="text-green-500">project icon</span>.
          </li>
          <li>
            Navigate to the <strong>Members</strong> section.
          </li>
          <li>
            Click on the <Plus className="inline w-4 h-4 text-amber-400" /> icon
            to open the Add Member form.
          </li>
          <li>Enter the member’s email and assign a role.</li>
        </ul>
        <img
          src="guide/ProjectDetIcon.png"
          alt="Add Member Screenshot"
          className="rounded-md  mt-4"
        />
         <img
          src="guide/ProjectPlus.png"
          alt="Add Member Screenshot"
          className="rounded-md  mt-4"
        />
         <img
          src="guide/member.png"
          alt="Add Member Screenshot"
          className="rounded-md  mt-4"
        />
      </section>

      {/* 4. User Roles */}
      <section className="border border-cyan-700 p-6 rounded-sm">
        <h2 className="text-xl font-semibold mb-3">
          4️⃣ Understanding Roles & Permissions
        </h2>
        <p className="mb-2">There are three roles with varying permissions:</p>

        <div className="space-y-2 text-sm">
          <p>
            <strong>🔑 Owner:</strong>
          </p>
          <ul className="list-disc pl-6">
            <li>Full project management: create, edit, delete.</li>
            <li>Can manage all tasks, members, subtasks, and notes.</li>
          </ul>

          <p>
            <strong>🛠️ Project Admin:</strong>
          </p>
          <ul className="list-disc pl-6">
            <li>Edit/delete project (not create).</li>
            <li>Can manage tasks, subtasks, members, and notes.</li>
          </ul>

          <p>
            <strong>👤 Member:</strong>
          </p>
          <ul className="list-disc pl-6">
            <li>Can only view projects and manage their own tasks.</li>
            <li>Manage their own subtasks and notes.</li>
          </ul>
        </div>
      </section>

      {/* 5. Change Password */}
      <section className="border border-cyan-700 p-6 rounded-sm">
        <h2 className="text-xl font-semibold mb-3">
          5️⃣ How to Change Your Password
        </h2>
        <ul className="list-decimal pl-6 space-y-1 text-sm">
          <li>
            Go to your <strong>Profile Settings</strong>.
          </li>
          <li>
            Click on the <strong>Security</strong> tab.
          </li>
          <li>
            Enter your <strong>current password</strong> and a{" "}
            <strong>new password</strong>.
          </li>
          <li>
            Click <strong>Update</strong> to save changes.
          </li>
        </ul>
        <img
          src="guide/updatepass.png"
          alt="Change Password Screenshot"
          className="rounded-md  mt-4"
        />
      </section>
    </div>
  );
}
