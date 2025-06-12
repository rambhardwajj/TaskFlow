import { Router } from "express";
import app from "../app";
import { isLoggedIn } from "../middlewares/auth.middleware";
import {
  createTask,
  deleteTask,
  updateTask,
  getTasks,
  getTaskById,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  addAttachments,
  deleteAttachments,
  getSubTasks,
  getUserTasks,
  updateTaskStatus,
} from "../controllers/task.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";
import { upload, uploadAttachments } from "../middlewares/multer.middleware";

const router = Router();

router.use(isLoggedIn);

//task
router.post(
  "/project/:projectId/create/tasks",
  checkUserPermission("create:task"),
  uploadAttachments,
  createTask
);
router.get(
  "/project/:projectId/tasks",
  checkUserPermission("view:task"),
  getTasks
);
router.get(
  "/project/:projectId/tasks/:taskId",
  checkUserPermission("view:task"),
  getTaskById
);
router.patch(
  "/project/:projectId/update/tasks/:taskId",
  checkUserPermission("edit:task"),
  // uploadAttachments,
  updateTask
);

router.patch(
  "/project/:projectId/update-status/tasks/:taskId",
  checkUserPermission("view:task"),
  updateTaskStatus
);

router.delete(
  "/project/:projectId/delete/tasks/:taskId",
  checkUserPermission("delete:task"),
  deleteTask
);
router.get(
  "/getAll",
  getUserTasks
);

//subtask
router.post(
  "/project/:projectId/tasks/:taskId/subTasks",
  checkUserPermission("create:subtask"),
  createSubTask
);
router.patch(
  "/project/:projectId/tasks/:taskId/update/subTasks/:subTaskId",
  checkUserPermission("edit:subtask"),
  updateSubTask
);
router.delete(
  "/project/:projectId/tasks/:taskId/delete/subTasks/:subTaskId",
  checkUserPermission("delete:subtask"),
  deleteSubTask
);
router.get(
  "/project/:projectId/tasks/:taskId/subTasks/getAll",
  checkUserPermission("view:subtask"),
  getSubTasks
)

// attachments 
router.post("/project/:projectId/tasks/:taskId/attachments", checkUserPermission("edit:task"), uploadAttachments, addAttachments)
router.delete('/project/:projectId/tasks/:taskId/attachments/:attachmentId', checkUserPermission('delete:task'), uploadAttachments, deleteAttachments);

export default router;
