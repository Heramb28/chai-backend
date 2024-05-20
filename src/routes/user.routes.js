import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
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


export default router