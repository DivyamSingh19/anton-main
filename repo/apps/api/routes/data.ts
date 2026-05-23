import express,{ Request,Response,NextFunction } from "express";
import { DataController } from "../controllers/user/data";
import { userAuthMiddleware } from "../middlewares/auth/user";

const controller = new DataController()
const dataRouter = express.Router()


dataRouter.get("/projects",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.allProjects(req,res)
    } catch (error) {
        next()
    }
})


export default dataRouter