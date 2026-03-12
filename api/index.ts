import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userAuth from "./routes/auth"
import connectDB from "./config/mongo"
import { dataLength } from "ethers"
import dataRouter from "./routes/data"

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config() 
connectDB()
 
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



//user routes
    //auth
    app.use("/api/user/auth",userAuth)




    //data 
    app.use("/api/user/data",dataRouter)




    //wallet




app.listen(port,()=>{
    console.log("Server started on:",port)
})