import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,//isme ham btate hai kaha se data accept krna hai
    credentials:true
}))

app.use(express.json({limit:"16kb"}))//jab form se data aae usse handle krte hai

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())



export {app}
