import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createNote, deleteNote, getAll, getNoteById, updateNote } from "../controllers/note.controller";
import { checkUserPermission } from "../middlewares/hasPermission.middleware";

const router =  Router()

router.use(isLoggedIn)

router.post('/createNote/:projectId', checkUserPermission('create:note'), createNote)
router.get('/getNoteById/:noteId', checkUserPermission('view:note'), getNoteById)
router.get('/getAll', checkUserPermission('view:note'), getAll) 
router.delete('/:noteId', checkUserPermission('delete:note'), deleteNote )
router.patch('/update/:noteId',checkUserPermission('edit:note'), updateNote)

export default router 