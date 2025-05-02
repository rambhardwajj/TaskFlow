import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createNote, deleteNote, getAll, getNoteById, updateNote } from "../controllers/note.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";

const router =  Router()

router.use(isLoggedIn)

router.post('/project/:projectId/create/notes', checkUserPermission('create:note'), createNote)
router.get('/project/:projectId/notes', checkUserPermission('view:note'), getAll) 
router.get('/project/:projectId/notes/:noteId', checkUserPermission('view:note'), getNoteById)
router.patch('/project/:projectId/update/notes/:noteId',checkUserPermission('edit:note'), updateNote)
router.delete('/project/:projectId/delete/notes/:noteId', checkUserPermission('delete:note'), deleteNote )

export default router 