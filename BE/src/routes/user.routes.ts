import {Router} from "express"
import {forgotPassword, getUser, googleLogin, loginUser, logOutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, updatePassword, verifyUser} from "../controllers/user.controller"
import {upload} from "../middlewares/multer.middleware"
import { isLoggedIn } from "../middlewares/auth.middleware"
import { authLimiter, emailsLimiter } from "../middlewares/ratelimitter.middleware"

const router = Router()

router.post('/auth/register', upload.single("avatar") ,registerUser)

router.post('/auth/login', authLimiter, loginUser)
router.get('/auth/verify/:token', verifyUser)
router.post('/auth/resend-verification',emailsLimiter, resendVerificationEmail)
router.get('/auth/logout', isLoggedIn,  logOutUser)
router.post('/auth/forgot-password',emailsLimiter, forgotPassword)
router.post('/auth/update-password',isLoggedIn,  updatePassword)
router.post('/auth/reset-password/:resetToken', resetPassword)
router.get('/auth/refresh-token', refreshAccessToken)
router.get('/auth/me', isLoggedIn , getUser ) 
router.post("auth/google-auth", googleLogin)

export default router 