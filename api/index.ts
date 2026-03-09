import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userAuth from "./routes/user/auth"



const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config() 

const port = process.env.PORT 

declare global{
    namespace Express{
        interface Request{
            userId?:string,
            adminId?:string,
            organizationId?:string,
            engineerId?:string
        }
    }
}

//admin routes





//user routes
    //auth
    app.use("/api/user/auth",userAuth)




//engieer routes





//organization routes




app.listen(port,()=>{
    console.log("Server started on:",port)
})