import { IUser, User } from "../models/user.models";
import {IProject, Project} from "../models/project.models"

export const UserRoles = {
  admin: [
    "create:project",
    "view:project",
    "delete:project",
    "update:project",
    "assign:project",
    "unassign:project",
    
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
  manager:[
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
export type PermissionType = typeof UserRoles[UserRoleType][number]


const hasPermission = (  userId :number , projectName: string , permission: PermissionType)=>{
    const user = User.findOne({_id: userId})
    const userProjectName = Project.findOne({name: projectName})

    
}


export const AvailableUserRoles = Object.values(UserRoles);
