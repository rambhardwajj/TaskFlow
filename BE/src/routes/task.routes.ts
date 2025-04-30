import { Router } from "express";
import app from "../app";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createTask } from "../controllers/task.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";
import { uploadAttachments } from "../middlewares/multer.middleware";

const router = Router();

router.use(isLoggedIn)

router.post('/create/:projectId', checkUserPermission("create:task"), uploadAttachments,  createTask )


export default router