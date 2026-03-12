import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userAuth from "./routes/auth"
import connectDB from "./config/mongo"
import { dataLength } from "ethers"
import dataRouter from "./routes/data"
import profileRouter from "./routes/profile"
import webhookRouter from "./routes/webHooks"
import walletRouter from "./routes/wallet"
import projectRouter from "./routes/projects"
import killSwitchRouter from "./routes/killswitch"
import timelockRouter from "./routes/timelock"

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
//profile
app.use("/api/user/profile",profileRouter)
//webhook
app.use("/api/user/webhook",webhookRouter)
//data 
app.use("/api/user/data",dataRouter)
//wallet
app.use("/api/user/wallet",walletRouter)
//projects
app.use("/api/user/projects",projectRouter)
//killswitch
app.use("/api/user/killswitch",killSwitchRouter)
//timelock
app.use("/api/user/timelock",timelockRouter)


app.listen(port,()=>{
    console.log("Server started on:",port)
})