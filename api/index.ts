import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userAuth from "./routes/auth"
import connectDB from "./config/mongo"
import dataRouter from "./routes/data"
import profileRouter from "./routes/profile"
import webhookRouter from "./routes/webHooks"
import walletRouter from "./routes/wallet"
import projectRouter from "./routes/projects"
import killswitchRouter from "./blockchain/routes/killswitch.routes"
import timelockRouter from "./blockchain/routes/timelock.routes"
import monitoringRouter from "./routes/monitoring"
import { initKafkaProducer } from "./kafka/config"
import { ethers } from "ethers"
import { delegatedAuthorityRouter } from "./blockchain/routes/delegated-authority.routes"
const app = express()

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: [
  "http://localhost:3001",
  "http://localhost:3000"
], credentials: true }));
app.use(cookieParser())
dotenv.config() 
connectDB()
 
const port = process.env.PORT 
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);


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
app.use("/api/user/killswitch",killswitchRouter)
//timelock
app.use("/api/user/timelock",timelockRouter)
//monitoring
app.use("/api/user/monitoring",monitoringRouter)

app.use(
  "/api/delegated-authority",
  delegatedAuthorityRouter(signer, process.env.CONTRACT_ADDRESS!)
);
const start = async () => {
  await initKafkaProducer();

  app.listen(port, () => {
    console.log("Server running on",port);
  });
};

start();