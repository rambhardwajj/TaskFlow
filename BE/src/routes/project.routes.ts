import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { addMember, createProject, deleteProject, getProjectById, getProjectMembers, getProjects, removeMember, updateProject } from "../controllers/project.controllers";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";


const router = Router();

router.use(isLoggedIn)

router.post('/create', createProject)
router.get('/getAll', getProjects)
router.get('/:projectId', checkUserPermission("view:project") , getProjectById )
router.patch('/update/:projectId',checkUserPermission("edit:project"), updateProject )
router.delete('/delete/:projectId',checkUserPermission("delete:project"), deleteProject )

router.post('/addMember/:projectId', checkUserPermission("add:member"), addMember)
router.delete('/removeMember/:projectId', checkUserPermission('delete:member'), removeMember)
router.delete('/updateMember/:projectId', checkUserPermission('delete:member'), removeMember)

router.get('/getMembers/:projectId', checkUserPermission("view:project"), getProjectMembers)


export default router;