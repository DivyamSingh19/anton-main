import { WebhookController } from "../controllers/integrations/user";
import express,{Request,Response,NextFunction}from "express"
import { userAuthMiddleware } from "../middlewares/auth/user";


const webhookRouter = express.Router()
const controller = new WebhookController()


webhookRouter.post("/discord",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.discord(req,res)
    } catch (error) {
        next()
    }
})

webhookRouter.post("/slack",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.slack(req,res)
    } catch (error) {
        next()
    }
})

webhookRouter.delete("/discord",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.removeDiscord(req,res)
    } catch (error) {
        next()
    }
})

webhookRouter.delete("/slack",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.removeSlack(req,res)
    } catch (error) {
        next()
    }
})
webhookRouter.put("/discord",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.updateDiscord(req,res)
    } catch (error) {
        next()
    }
})

webhookRouter.put("/slack",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        controller.updateSlack(req,res)
    } catch (error) {
        next()
    }
})

export default webhookRouter