import Router from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { addMember, createProject, deleteProject, getProjectById, getProjectMembers, getProjects, removeMember, updateMemberRole, updateProject } from "../controllers/project.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";


const router = Router();

router.use(isLoggedIn)

router.post('/create/projects', createProject)
router.get('/projects', getProjects)
router.get('/:projectId', checkUserPermission("view:project") , getProjectById )
router.patch('/update/:projectId',checkUserPermission("edit:project"), updateProject )
router.delete('/delete/:projectId',checkUserPermission("delete:project"), deleteProject )
router.post('/:projectId/addMember/:memId', checkUserPermission("add:member"), addMember)
router.delete('/:projectId/removeMember', checkUserPermission('delete:member'), removeMember)
router.patch('/:projectId/updateMember/', checkUserPermission('add:member'), updateMemberRole)

router.get('/:projectId/getMembers/', checkUserPermission("view:project"), getProjectMembers)


export default router;