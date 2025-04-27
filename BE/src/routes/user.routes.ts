import {Router} from "express"
import {forgotPassword, loginUser, logOutUser, registerUser, resendVerificationEmail, verifyUser} from "../controllers/user.controllers"
import {upload} from "../middlewares/multer.middleware"
import { isLoggedIn } from "../middlewares/auth.middleware"

const router = Router()


router.post('/register', upload.single("avatar") ,registerUser)
router.get('/verify/:token', verifyUser)
router.get('/resendverificationmail', resendVerificationEmail )
router.get('/login', loginUser)
router.get('/logout', isLoggedIn,  logOutUser)
router.get('/forgotpassword', forgotPassword )

export default router 