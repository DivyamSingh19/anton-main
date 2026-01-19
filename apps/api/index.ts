import express from "express"
import cors from "cors"
import projectRouter from "./routes/project.routes"
import authRouter from "./routes/auth.routes"
import { Request,Response } from "express"
import { HTTPStatus } from "./utils/error"
const app = express()
const port = 4000

declare global{
    namespace Express{
        interface Request{
            userId?:string
            orgId?:string
            engId?:string
        }
    }
}
app.use(express.json())
app.use(cors())

app.get("/",(req:Request,res:Response)=>{
    return res.status(HTTPStatus.Success).json({
        success:true,
        message:"API working"
    })
})

app.listen(port,()=>{
    console.log("Server started on port:", port)
})