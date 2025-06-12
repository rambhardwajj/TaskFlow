import { getAllProjects } from "@/redux/slices/projectSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";

export interface Project {
  role: string;
  projectId: string;
  name: string;
  createdAt: string;
  memberCount: number;
  createdBy: {
    username: string;
    email: string;
  };
}

export default function ProjectTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const Initials = (props: { ini: string }) => {
    return (
      <span className="bg-cyan-600 px-2 mr-3 text-violet-950 rounded-xs ">
        {props.ini}
      </span>
    );
  };

  const handleCreateProject = async () => {
    try {
      await axios.post(
        "http://localhost:8200/api/v1/project/create",
        {
          name: projectName,
          desc: projectDesc,
        },
        { withCredentials: true }
      );
      toast.success("Project created successfully!");
      dispatch(getAllProjects());
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create project.");
      console.error(error);
    }
  };

  const [delOpen, setDelOpen] = useState(false);
  const handleDeleteProject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8200/api/v1/project/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Project deleted successfully!");
      dispatch(getAllProjects());
      setDelOpen(false);
    } catch (error) {
      toast.error("Failed to delete project.");
      console.error(error);
    }
  };

  return (
    <div
      className={`w-full p-4 overflow-auto custom-scrollbar
    ${loading ? "opacity-50" : ""}
    `}
    >
      <div className="overflow-x-none custom-scrollbar">
        <table className="min-w-full table-auto text-left  ">
          <thead className="bg-black text-zinc-200 sticky top-0 z-10  ">
            <tr>
              <th className="py-3 px-5 text-sm font-semibold  tracking-wide ">
                Project Name
              </th>
              <th className="py-3 px-5 text-sm font-semibold  tracking-wide">
                Created At
              </th>
              <th className="py-3 px-5 text-sm font-semibold  tracking-wide">
                Created By
              </th>
              <th className="py-3 px-1 text-sm font-semibold  tracking-wide">
                Members
              </th>
              <th className="py-3 px-1 text-sm font-semibold  tracking-wide">
                Your Role
              </th>
              <th className="py-3 px-1 text-sm font-semibold  tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {
              projects.map((project, index) => (
                <tr
                  key={index}
                  className="bg-neutral-800/60 border-b border-zinc-800 transition-transform hover:scale-[1.002] hover:bg-neutral-800 "
                >
                  <td className="my-3 ml-5 flex justify-between  font-medium text-zinc-100">
                    <Link
                      className=" text-sm hover:scale-[1.08] hover:text-blue-600 cursor-pointer"
                      to={`/${project.projectId}/tasks`}
                    >
                      {<Initials ini={project.name.charAt(0)} />} {project.name}
                    </Link>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link to={`/${project.projectId}`}>
                        <SquarePen className=" hover:scale-[1.1] hover:text-green-400 w-5 h-5 mx-2  text-green-500 cursor-pointer" />
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-zinc-400 text-xs">
                    {project.createdAt}
                  </td>
                  <td className="py-3 px-5 text-zinc-400 text-xs">
                    {project.createdBy.username}
                  </td>
                  <td className="py-3 px-5 text-zinc-400 text-xs">
                    {project.memberCount}
                  </td>
                  <td className="py-3 px-5 text-zinc-300 text-xs">
                    {project.role}
                  </td>
                  <td
                    className="py-3 px-5 text-red-600  "
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Delete  */}
                    <Dialog open={delOpen} onOpenChange={setDelOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="cursor-pointer "
                          onClick={(e) => {
                            e.stopPropagation();
                            setDelOpen(true);
                          }}
                        >
                          <Trash className=" w-5 hover:scale-[1.2] hover:text-red-500" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-neutral-900 rounded-b-sm hover:bg-neutral-800 text-white">
                        <div className="space-y-4">
                          <DialogTitle>
                            Are you sure you want to delete this project -{" "}
                            {project.name} ?
                          </DialogTitle>
                          <div className="flex justify-end space-x-2 pt-4">
                            <button
                              onClick={() => setDelOpen(false)}
                              className="rounded-md border px-4 py-2 text-sm hover:bg-black cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setDelOpen(true);
                                handleDeleteProject(project.projectId);
                              }}
                              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white cursor-pointer hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            }
            <tr className=" bg-neutral-900 rounded-b-sm hover:bg-neutral-800 cursor-pointer">
              <td className=" py-3 px-5 text-center  text-cyan-400">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="cursor-pointer "
                      onClick={() => setOpen(true)}
                    >
                      Create Project +
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-neutral-900 rounded-b-sm hover:bg-neutral-800 text-white">
                    <div className="space-y-4">
                      <DialogTitle>Create New Project</DialogTitle>
                      <p className="text-sm text-gray-500">
                        Enter the name and description for your project.
                      </p>

                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium"
                        >
                          Project Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:cyan-blue-500"
                          placeholder="e.g. ChaiCode Landing"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="desc"
                          className="block text-sm font-medium"
                        >
                          Description
                        </label>
                        <textarea
                          id="desc"
                          rows={3}
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. A bakwaas project."
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <button
                          onClick={() => setOpen(false)}
                          className="rounded-md border px-4 py-2 text-sm hover:bg-black cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateProject}
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white cursor-pointer hover:bg-cyan-700"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
