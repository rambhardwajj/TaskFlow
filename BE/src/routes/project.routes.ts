import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/project.controllers";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";


const router = Router();

router.use(isLoggedIn)

router.post('/create', createProject)
router.get('/getAll', getProjects)
router.get('/:projectId', checkUserPermission("view:project") , getProjectById )
router.patch('/update/:projectId',checkUserPermission("edit:project"), updateProject )
router.delete('/delete/:projectId',checkUserPermission("delete:project"), deleteProject )

router.post('/addMember', checkUserPermission("add:member"))

export default router;