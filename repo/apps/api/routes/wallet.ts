import express,{ Request,Response,NextFunction } from "express";
import { WalletController } from "../controllers/user/wallet";
import { userAuthMiddleware } from "../middlewares/auth/user";



const walletRouter = express.Router()
const controller = new WalletController()


walletRouter.post("/add",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.add(req,res)
    } catch (error) {
        next()
    }
})


walletRouter.post("/update",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.update(req,res)
    } catch (error) {
        next()
    }
})





export default walletRouter