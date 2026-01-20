import express from "express"
import cors from "cors"
import projectRouter from "./routes/project.routes"
import authRouter from "./routes/auth/auth.routes"
import { Request,Response } from "express"
import { HTTPStatus } from "./utils/error"
import organizationRouter from "./routes/auth/organization.route"
import orgAdmin from "./routes/auth/organization.route"
import { globalErrorHandler } from "./middlewares/error"
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
//solopreneur
app.use('/',authRouter)

//org_admin
app.use('/',orgAdmin)


//engineers



app.listen(port,()=>{
    console.log("Server started on port:", port)
})
app.use(globalErrorHandler)