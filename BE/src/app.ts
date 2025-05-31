import express, {Application} from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import userRouter from "./routes/user.routes"
import projectRouter from "./routes/project.routes"
import taskRouter from "./routes/task.routes"
import noteRouter from "./routes/note.routes"
import { errorHandler } from "./middlewares/error.middleware"
 
const app : Application  =  express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors(
    {credentials: true,
        origin: ['http://localhost:5173'],
    }
))

app.use("/api/v1/user", userRouter )
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/task", taskRouter )
app.use("/api/v1/note", noteRouter)

app.use(errorHandler)

export default app 