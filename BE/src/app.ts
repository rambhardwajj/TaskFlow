import express, {Application} from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import userRouter from "./routes/user.routes"
import projectRouter from "./routes/project.routes"
import { errorHandler } from "./middlewares/error.middleware"
 
const app : Application  =  express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors())



app.use("/api/v1/user", userRouter )
app.use("/api/v1/project", projectRouter)

app.use(errorHandler)

export default app 