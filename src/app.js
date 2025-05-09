import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mk-video-wall.netlify.app"], // both dev and production
    credentials: true,
  })
);
// user also enter json file data so we can set limit otherwise server crash
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)

//http://localhost:8000/api/v1/users/register




export{app}