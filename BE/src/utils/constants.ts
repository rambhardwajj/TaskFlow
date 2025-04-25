export const ResponseStatus = {
  Success: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
} as const;

 
export const UserRoles = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
} as const ;

export type UserRoleType = typeof UserRoles[keyof typeof UserRoles]

export const AvailableUserRoles = Object.values(UserRoles);


export const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const ;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus]
export const AvailableTaskStatuses = Object.values(TaskStatus);
 