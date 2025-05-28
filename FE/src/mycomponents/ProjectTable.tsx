import { Link } from "react-router-dom";

const mockProjects = [
  { name: "Simple Plan", sharedWith: "Ram_accounts", lastAccessed: "30m ago" },
  {
    name: "Demo_for_MArina",
    sharedWith: "Ram_accounts",
    lastAccessed: "Mar 12",
  },
  { name: "Calendar", sharedWith: "Ram_accounts", lastAccessed: "Mar 12" },
  { name: "Demo - Marina", sharedWith: "Ram_accounts", lastAccessed: "Mar 4" },
  {
    name: "Software Development",
    sharedWith: "Ram_accounts",
    lastAccessed: "Feb 25",
  },
];

export default function ProjectTable( props:any) {
  console.log(props)
  const Initials = (props: { ini: string }) => {
    return <span className="bg-sky-400 px-2 rounded-lg ">{props.ini}</span>;
  };

  return (
    <div className="w-full p-4 overflow-auto ">
      <div className="overflow-x-none ">
        <table className="min-w-full table-auto text-left  ">
          <thead className="bg-black text-zinc-200 sticky top-0 z-10  ">
            <tr>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide ">
                Project Name
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Assigned To
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Assigned By
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Members
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Your Role
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Last Accessed
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProjects.map((project, index) => (
              <tr
                key={index}
                className="bg-neutral-900 border-b border-zinc-800 transition-transform hover:scale-[1.01] hover:bg-neutral-800 cursor-pointer"
              >
                <td className="py-3 px-5 font-medium text-zinc-100">
                  <Link to="/:projectId/tasks">
                    {<Initials ini={project.name.charAt(0)} />} {project.name}
                  </Link>
                </td>
                <td className="py-3 px-5 text-zinc-400">
                  {project.sharedWith}
                </td>
                <td className="py-3 px-5 text-zinc-400">
                  {project.sharedWith}
                </td>
                <td className="py-3 px-5 text-zinc-400">21</td>
                <td className="py-3 px-5 text-zinc-300">Member</td>
                <td className="py-3 px-5 text-zinc-300">
                  {project.lastAccessed}
                </td>
              </tr>
            ))}
            <tr className="bg-neutral-900 rounded-b-sm hover:bg-neutral-800 cursor-pointer">
              <Link to="/projects/create">
              <td className="py-3 px-5 text-center  text-cyan-400">
                 + Create Project
              </td>
              
              </Link>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
