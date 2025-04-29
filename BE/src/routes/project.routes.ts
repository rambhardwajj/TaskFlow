import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createProject, getProjectById, getProjects } from "../controllers/project.controllers";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";


const router =  Router();

router.use(isLoggedIn)

router.post('/create', createProject)
router.get('/getAll', getProjects)
router.get('/:projectId', checkUserPermission("view:project") , getProjectById )

export default router;