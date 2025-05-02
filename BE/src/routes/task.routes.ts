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
} from "../controllers/task.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";
import { uploadAttachments } from "../middlewares/multer.middleware";

const router = Router();

router.use(isLoggedIn);

//task
router.post(
  "/create/project/:projectId",
  checkUserPermission("create:task"),
  uploadAttachments,
  createTask
);
router.patch(
  "/update/:taskId/project/:projectId",
  checkUserPermission("edit:task"),
  uploadAttachments,
  updateTask
);
router.delete(
  "/delete/:taskId/project/:project",
  checkUserPermission("delete:task"),
  deleteTask
);
router.get(
  "/:taskId/project/:projectId",
  checkUserPermission("view:task"),
  getTaskById
);
router.get(
  "/getTasks/project/:projectId",
  checkUserPermission("view:task"),
  getTasks
);

//subtask
router.post(
  "/:taskId/project/:projectId/subTask",
  checkUserPermission("create:subtask"),
  createSubTask
);
router.delete(
  "/:taskId/project/:projectId/subTask/:subTaskId",
  checkUserPermission("delete:subtask"),
  deleteSubTask
);
router.patch(
  "/:taskId/project/:projectId/subTask/:subTask",
  checkUserPermission("edit:subtask"),
  updateSubTask
);

export default router;
