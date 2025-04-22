import express, {Application} from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'


const app : Application  =  express()
app.use( express.json() )
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.get('/', (req, res) =>{
    res.send("Server in on ")
})

export default app 