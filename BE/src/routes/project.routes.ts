import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { addMember, createProject, deleteProject, getProjectById, getProjectMembers, getProjects, removeMember, updateMemberRole, updateProject } from "../controllers/project.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";


const router = Router();

router.use(isLoggedIn)

router.post('/create',  createProject)
router.get('/', getProjects)
router.get('/:projectId', checkUserPermission("view:project") , getProjectById )
router.patch('/update/:projectId',checkUserPermission("edit:project"), updateProject )
router.delete('/delete/:projectId',checkUserPermission("delete:project"), deleteProject )
router.post('/:projectId/add', checkUserPermission("add:member"), addMember)
router.patch('/:projectId/update/:memId', checkUserPermission('add:member'), updateMemberRole)
router.delete('/:projectId/remove/:memId', checkUserPermission('delete:member'), removeMember)
router.get('/:projectId/getMembers', checkUserPermission("view:project"), getProjectMembers)

export default router;