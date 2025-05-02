import {Router} from "express"
import {forgotPassword, loginUser, logOutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, verifyUser} from "../controllers/user.controller"
import {upload} from "../middlewares/multer.middleware"
import { isLoggedIn } from "../middlewares/auth.middleware"
import { authLimiter, emailsLimiter } from "../middlewares/ratelimitter.middleware"

const router = Router()


router.post('/auth/register', upload.single("avatar") ,registerUser)
router.get('/auth/login', authLimiter, loginUser)
router.get('/auth/verify/:token', verifyUser)
router.get('/auth/resend-verification',emailsLimiter, resendVerificationEmail)
router.get('/auth/logout', isLoggedIn,  logOutUser)
router.get('/auth/forgot-password',emailsLimiter, forgotPassword)
router.get('/auth/reset-password/:resetToken', resetPassword)
router.get('/auth/refresh-token', refreshAccessToken)

export default router 