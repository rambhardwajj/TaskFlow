
import { ProjectMember } from "../models/projectMember.models";
import { ResponseStatus } from "./constants";
import { CustomError } from "./CustomError";

export const UserRoles = {
  owner: [
    "create:project",
    "view:project",
    "delete:project",
    "edit:project",
    "assign:project",
    "unassign:project",
    "add:member",
    "delete:member",

    "view:task",
    "edit:task",
    "delete:task",
    "assign:task",
    "unassign:task",

    "view:subtask",
    "create:subtask",
    "delete:subtask",
    "edit:subtask"
  ],
  projectAdmin:[
    "create:task",
    "view:task",
    "edit:task",
    "delete:task",
    "assign:task",
    "unassign:task",

    "view:subtask",
    "create:subtask",
    "delete:subtask",
    "edit:subtask"
  ],
  member:[
    "view:subtask",
    "create:subtask",
    "delete:subtask",
    "edit:subtask"
  ]
} as const;

export type UserRoleType = keyof typeof UserRoles;

// 2d array with role and the associated permissions 
export type PermissionType = typeof UserRoles[UserRoleType][number]


export const hasPermission = async (  userId :string , projectId: string , permission: PermissionType)=>{
  const userProjectMember = await ProjectMember.findOne({user:userId, project:projectId })

  const userRole = userProjectMember?.role

  if( !userRole ){
    throw new CustomError(ResponseStatus.NotFound , "User role doesn't exists")
  }

  return (UserRoles[userRole] as readonly PermissionType[] ).includes(permission)
}

export const AvailableUserRoles = Object.values(UserRoles);
