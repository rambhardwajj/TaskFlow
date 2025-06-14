import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Edit, Pencil, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchProjectTasks } from "@/redux/slices/projectsTasksSlice";
import { EditProjectDialog } from "@/mycomponents/EditProject";
import { Badge } from "@/components/ui/badge";
import { EditMemberDialog } from "@/mycomponents/EditMemberDialog";
import { DeleteMemberDialog } from "@/mycomponents/DeleteMemberDialog";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AddMemberDialog } from "@/mycomponents/AddMemberDialog";
import { fetchUserRole } from "@/redux/slices/userRoleSlice";
import { API_BASE_URL } from "../../config";

interface Member {
  _id: string;
  projectName: string;
  role: string;
  userInfo: {
    avatar: {
      localPath: string;
      url: string;
      _id: string;
    };
    email: string;
    userName: string;
  };
}

export interface ProjectInfo {
  _id: string;
  projectName: string;
  projectDesc: string;
  projectModified: string; // ISO date string
  projectOwner: string; // userId
  totalMembers: number;
  userName: string;
  members: any;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { tasksByProject } = useSelector(
    (state: RootState) => state.projectTasks
  );

  // if (projectId) console.log("tbp", tasksByProject[projectId]);
  // console.log("loading", loading);

  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [edited, setEdited] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/project/${projectId}`,
          {
            withCredentials: true,
          }
        );
        console.log("projectInfo", res.data.data[0]);
        setProject(res.data.data[0]);
      } catch (error) {
        toast.error("Failed to load project");
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/project/${projectId}/getMembers`,
          {
            withCredentials: true,
          }
        );
        console.log("members", res.data.data);
        setMembers(res.data.data);
      } catch (error) {
        toast.error("Failed to load members");
      }
    };

    fetchProjectDetails();
    fetchMembers();
    if (projectId) dispatch(fetchProjectTasks(projectId));
  }, [projectId, edited]);

  const handleProjectEdit = async ({
    name,
    desc,
  }: {
    name: string;
    desc: string;
  }) => {
    // Call your PATCH API here
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/project/update/${projectId}`,
        {
          name,
          desc,
        },
        {
          withCredentials: true,
        }
      );

      console.log("project updated", res.data.data);
      setEdited(!edited);
    } catch (error) {
      toast.error("Error is updating the project ")
      console.log("Error in handleProjectEdit", error);
    }

    console.log("Submit edit:", name, desc);
  };
  const handleAddMember = async () => {
    setAddMemberOpen(false);
    setEdited(!edited);
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembersAgain = () => {
    setEdited(!edited);
  };

  
  const { role } = useSelector(
    (state: RootState) => state.userRole
  );

  useEffect(() => {
    if (projectId) {
      dispatch(fetchUserRole(projectId));
    }
  }, [projectId, dispatch]);

  return (
    <div className="flex min-h-[90vh] custom-scrollbar  w-full  bg-neutral-900 text-neutral-200">
      {/* Project Details - 3/4 */}
      <div className="w-3/4 p-8 space-y-6 bg-neutral-900  shadow-sm">
        {project ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                {project.projectName}
              </h1>

              {role!=="member" && <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={() => setEditProjectOpen(true)}
                    className="hover:scale-[1.1]"
                  >
                    <Edit
                      size={28}
                      className="text-green-500 hover:text-green-400 cursor-pointer"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="border-1 border-neutral-600">
                  <p> Edit Project </p>
                </TooltipContent>
              </Tooltip>}
              <EditProjectDialog
                open={editProjectOpen}
                onOpenChange={setEditProjectOpen}
                initialName={project.projectName}
                initialDesc={project.projectDesc}
                onSubmit={handleProjectEdit}
              />
            </div>

            <span className="text-xs text-neutral-400">
              Last updated: {new Date(project.projectModified).toLocaleString()}
            </span>
            <p className="text- text-neutral-300">{project.projectDesc}</p>

            <div className="grid grid-cols-2 gap-4 text-sm mt-6">
              <div className="p-4 bg-[#2a2a2a] rounded-lg shadow-inner">
                <p className="font-medium text-neutral-400">Total Members</p>
                <p className="text-xl font-bold text-white">
                  {project.totalMembers}
                </p>
              </div>

              <div className="p-4 bg-[#2a2a2a] rounded-lg shadow-inner">
                <p className="font-medium text-neutral-400">Project Owner</p>
                <p className="text-base text-white">{project.userName}</p>
              </div>
            </div>

            <div className="p-5 max-h-[47vh] overflow-y-scroll  custom-scrollbar  bg-neutral-900 shadow-sm space-y-4">
              <div>
                {projectId && tasksByProject[projectId]?.TODO?.length ? (
                  tasksByProject[projectId].TODO.map((task) => (
                    <div
                      key={task._id}
                      className="px-4 py-2 m-3 flex justify-between bg-neutral-800 rounded-lg border border-[#333] hover:bg-[#333] transition-colors"
                    >
                      <div>
                        <h3 className="text-md font-medium text-white">
                          {task.title}
                        </h3>
                        <Badge
                          className=" bg-cyan-950 text-white "
                          variant="secondary"
                        >
                          Backlog
                        </Badge>
                      </div>

                      <div className=" flex gap-2 mt-2 text-sm text-neutral-400 space-y-1">
                        <p>
                          <p className="font-medium text-neutral-300">
                            Assigned To:
                          </p>{" "}
                          {task.assignedTo?.userName} ({task.assignedTo?.email})
                        </p>
                        <p>
                          <p className="font-medium text-neutral-300">
                            Assigned By:
                          </p>{" "}
                          {task.assignedBy?.userName} ({task.assignedBy?.email})
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 ">No TODO tasks available.</p>
                )}
              </div>

              <div>
                {projectId && tasksByProject[projectId]?.IN_PROGRESS?.length ? (
                  tasksByProject[projectId].IN_PROGRESS.map((task) => (
                    <div
                      key={task._id}
                      className="px-4 py-2 m-3 flex justify-between bg-neutral-800 rounded-lg border border-[#333] hover:bg-[#333] transition-colors"
                    >
                      <div>
                        <h3 className="text-md font-medium text-white">
                          {task.title}
                        </h3>
                        <Badge
                          className="bg-blue-900 text-white "
                          variant="secondary"
                        >
                          In Progress
                        </Badge>
                      </div>

                      <div className=" flex gap-2 mt-2 text-sm text-neutral-400 space-y-1">
                        <p>
                          <p className="font-medium text-neutral-300">
                            Assigned To:
                          </p>{" "}
                          {task.assignedTo?.userName} ({task.assignedTo?.email})
                        </p>
                        <p>
                          <p className="font-medium text-neutral-300">
                            Assigned By:
                          </p>{" "}
                          {task.assignedBy?.userName} ({task.assignedBy?.email})
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500">
                    No In Progress tasks available.
                  </p>
                )}
              </div>

              <div>
                {projectId && tasksByProject[projectId]?.DONE?.length ? (
                  tasksByProject[projectId].DONE.map((task) => (
                    <div
                      key={task._id}
                      className="px-4 py-2 m-3 flex justify-between bg-neutral-800 rounded-lg border border-[#333] hover:bg-[#333] transition-colors"
                    >
                      <div>
                        <h3 className="text-md font-medium text-white">
                          {task.title}
                        </h3>
                        <Badge
                          className="bg-green-900 text-white "
                          variant="secondary"
                        >
                          Done
                        </Badge>
                      </div>

                      <div className=" flex gap-2 mt-2 text-sm text-neutral-400 space-y-1">
                        <p>
                          <p className="font-medium text-neutral-300">
                            Assigned To:
                          </p>{" "}
                          {task.assignedTo?.userName} ({task.assignedTo?.email})
                        </p>
                        <p>
                          <p className="font-medium text-neutral-300">
                            Assigned By:
                          </p>{" "}
                          {task.assignedBy?.userName} ({task.assignedBy?.email})
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500">No Done tasks available.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-neutral-400">Loading project details...</div>
        )}
      </div>

      {/* Member List - 1/4 */}
      <div className="w-1/4 p-6 bg-neutral-900 mr-1 shadow-lg border-l border-[#333] overflow-y-auto ">
        <div className="flex justify-between ">
          <div className="text-xl font-semibold mb-6 text-white">Members</div>
          { role!== "member" &&  <Tooltip>
            <TooltipTrigger>
              <button
                onClick={() => {
                  setAddMemberOpen(true);
                }}
                className="mt-[-25px] text-amber-500 cursor-pointer hover:scale-[1.1]"
              >
                <Plus />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add member in the project</p>
            </TooltipContent>
          </Tooltip>}

          {projectId && (
            <AddMemberDialog
              open={addMemberOpen}
              onOpenChange={setAddMemberOpen}
              projectId={projectId}
              onSuccess={handleAddMember}
            />
          )}
        </div>

        {members.length ? (
          <div className="space-y-1">
            {members.map((member, index) => (
              <div className="flex justify-between flex-wrap" key={index}>
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                  <img
                    src={member.userInfo.avatar.url}
                    alt={member.userInfo.userName}
                    className="w-15 h-15 rounded-full border border-neutral-700 object-cover"
                  />
                  <div className="hidden lg:block">
                    <p className="text-base font-medium text-white">
                      {member.userInfo.userName}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {member.userInfo.email}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Role: <span className="font-bold">{member.role}</span>
                    </p>
                  </div>
                </div>
                <div className=" mt-5">
                  {member.role !== "owner" && (role!=='member') && (
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setEditDialogOpen(true);
                          }}
                          className="hover:scale-[1.1] hover:text-cyan-500 cursor-pointer text-cyan-900 space-x-3 p-1"
                        >
                          <Pencil size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="border-1 border-neutral-800">
                        <p> Edit Member Role</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {member.role !== "owner" && (role!=='member') && (
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setDeleteDialogOpen(true);
                          }}
                          className="hover:scale-[1.1] hover:text-red-500 cursor-pointer text-red-900 space-x-3 p-1"
                        >
                          <Trash size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="border-1 border-neutral-800">
                        <p> Delete Member from Project</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {projectId && selectedMember && (
                    <EditMemberDialog
                      open={editDialogOpen}
                      onOpenChange={setEditDialogOpen}
                      member={selectedMember}
                      projectId={projectId}
                      onSuccess={fetchMembersAgain}
                    />
                  )}

                  {projectId && selectedMember && (
                    <DeleteMemberDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                      memberId={selectedMember._id}
                      projectId={projectId}
                      onSuccess={fetchMembersAgain}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400">No members found.</p>
        )}
      </div>
    </div>
  );
}
