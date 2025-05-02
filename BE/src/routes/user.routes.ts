import {Router} from "express"
import {forgotPassword, loginUser, logOutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, verifyUser} from "../controllers/user.controller"
import {upload} from "../middlewares/multer.middleware"
import { isLoggedIn } from "../middlewares/auth.middleware"

const router = Router()


router.post('/auth/register', upload.single("avatar") ,registerUser)
router.get('/auth/login', loginUser)
router.get('/auth/verify/:token', verifyUser)
router.get('/auth/resend-verification', resendVerificationEmail)
router.get('/auth/logout', isLoggedIn,  logOutUser)
router.get('/auth/forgot-password', forgotPassword)
router.get('/auth/reset-password', isLoggedIn, resetPassword)
router.get('/auth/refresh-token', refreshAccessToken)

export default router 