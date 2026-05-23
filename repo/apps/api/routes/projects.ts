import express,{ Request,Response,NextFunction } from "express";
import { ProjectController } from "../controllers/user/projects";
import { userAuthMiddleware } from "../middlewares/auth/user";
const projectRouter = express.Router()
const controller = new ProjectController()


projectRouter.post("/add",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.add(req,res)
    } catch (error) {
        next()
    }
})

projectRouter.get("/all",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.all(req,res)
    } catch (error) {
        next()
    }
})

projectRouter.post("/:id",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.id(req,res)
    } catch (error) {
        next()
    }
})

projectRouter.delete("/:id",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.delete(req,res)
    } catch (error) {
        next()
    }
})

projectRouter.put("/edit/:id",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.edit(req,res)
    } catch (error) {
        next()
    }
})

projectRouter.put("/status",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.status(req,res)
    } catch (error) {
        next()
    }
})


export default projectRouter