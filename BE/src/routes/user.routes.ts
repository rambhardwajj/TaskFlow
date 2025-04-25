import {Router} from "express"
import {loginUser, registerUser, resendVerificationEmail, verifyUser} from "../controllers/user.controllers"
import {upload} from "../middlewares/multer.middleware"

const router = Router()


router.post('/register', upload.single("avatar") ,registerUser)
router.get('/verify/:token', verifyUser)
router.get('/resendverificationmail', resendVerificationEmail )
router.get('/login', loginUser)

export default router
