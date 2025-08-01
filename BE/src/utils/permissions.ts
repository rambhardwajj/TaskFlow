import { ProjectMember } from "../models/projectMember.models";
import { ResponseStatus } from "./constants";
import { CustomError } from "./CustomError";
import { logger } from "./logger";

export const UserRoles = {
    owner: [
        "create:project",
        "view:project",
        "delete:project",
        "edit:project",
        "assign:project",
        "unassign:project",
        "add:member",
        "edit:member",
        "delete:member",

        "view:task",
        "create:task",
        "edit:task",
        "delete:task",
        "assign:task",
        "unassign:task",

        "view:subtask",
        "create:subtask",
        "delete:subtask",
        "edit:subtask",

        "view:note",
        "create:note",
        "delete:note",
        "edit:note",
    ],
    projectAdmin: [
        "create:task",
        "view:task",
        "edit:task",
        "delete:task",
        "assign:task",
        "unassign:task",

        "view:project",
        "delete:project",
        "edit:project",
        "add:member",
        "edit:member",
        "delete:member",

        "view:subtask",
        "create:subtask",
        "delete:subtask",
        "edit:subtask",

        "view:note",
        "create:note",
        "delete:note",
        "edit:note",
    ],
    member: [
        "create:task",
        "view:task",
        "view:project",

        "view:subtask",
        "create:subtask",
        "delete:subtask",
        "edit:subtask",

        "view:note",
        "create:note",
        "delete:note",
        "edit:note",
    ],
} as const;

export type UserRoleType = keyof typeof UserRoles;

// 2d array with role and the associated permissions
export type PermissionType = (typeof UserRoles)[UserRoleType][number];

export const hasPermission = async (
    userId: string,
    projectId: string,
    permission: PermissionType
) => {
    console.log("inside HasPermission");
    try {
        const userProjectMember = await ProjectMember.findOne({
            user: userId,
            project: projectId,
        });
        console.log("UserProjectMember", userProjectMember);

        const userRole = userProjectMember?.role;

        if (!userRole) {
            logger.error("Has permission Error ");
            throw new CustomError(
                ResponseStatus.NotFound,
                "User role doesn't exists"
            );
        }
        return (UserRoles[userRole] as readonly PermissionType[]).includes(
            permission
        );
    } catch (error) {
        console.log("Error in has Permission", error);
    }
};

export const AvailableUserRoles = Object.values(UserRoles);
