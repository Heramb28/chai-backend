import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
//injecting middleware,jo method use horha hai usse pehle inject kro
router.route("/register").post(
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    registerUser
)
//user ke bad sab route yha likhe jaenge
router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT , logoutUser)//verifyjwt middleware hai uske end me next likha hai to uske baad logout user run hoga

router.route("/refresh-token").post(refreshAccessToken)

export default router