export const ResponseStatus = {
  Success: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
} as const;



export const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const ;

export const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
  // docx - word doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // xlsx -  excel sheet
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus]
export const AvailableTaskStatuses = Object.values(TaskStatus);
 
