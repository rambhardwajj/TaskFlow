import { getAllProjects } from "@/redux/slices/projectSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
  const { projects, loading } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

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
                Created At
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Created By
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Members
              </th>
              <th className="py-3 px-5 text-sm font-semibold uppercase tracking-wide">
                Your Role
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? <div>Loading </div> : projects.map((project, index) => (
              <tr
                key={index}
                className="bg-neutral-900 border-b border-zinc-800 transition-transform hover:scale-[1.01] hover:bg-neutral-800 cursor-pointer"
              >
                <td className="py-3 px-5 font-medium text-zinc-100">
                  <Link to={`/${project.projectId}/tasks`}>
                    {<Initials ini={project.name.charAt(0)} />} {project.name}
                  </Link>
                </td>
                <td className="py-3 px-5 text-zinc-400">{project.createdAt}</td>
                <td className="py-3 px-5 text-zinc-400">
                  {project.createdBy.username}
                </td>
                <td className="py-3 px-5 text-zinc-400">
                  {project.memberCount}
                </td>
                <td className="py-3 px-5 text-zinc-300">{project.role}</td>
              </tr>
            ))}
            <tr className=" bg-neutral-900 rounded-b-sm hover:bg-neutral-800 cursor-pointer">
              <td className=" py-3 px-5 text-center  text-cyan-400">
                <Link to="/projects/create" className="py-3 px-5">
                  + Create Project
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
