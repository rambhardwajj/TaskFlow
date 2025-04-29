import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createProject, getProjects } from "../controllers/project.controllers";


const router =  Router();

router.use(isLoggedIn)

router.post('/create', createProject)
router.get('/getprojects', getProjects)

export default router;