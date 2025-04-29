import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createProject } from "../controllers/project.controllers";


const router =  Router();

router.post('/create', isLoggedIn, createProject  )

export default router;