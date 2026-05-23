import { WebhookController } from "../controllers/integrations/user";
import express,{Request,Response,NextFunction}from "express"
import { userAuthMiddleware } from "../middlewares/auth/user";
import { kafka, pushThreatAlert } from "../kafka/config";
import { producer } from "../kafka/consumer";

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

webhookRouter.get("/all",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        await controller.userwebhooks(req,res)
    } catch (error) {
        next()
    }
})

webhookRouter.post("/mock-webhook", async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { webhookUrl, message } = req.body;
        const targetUrl = webhookUrl || "https://httpbin.org/post";
        const targetMessage = message || "Mock Threat Alert from Kaizen";
        await producer.connect()
        await pushThreatAlert(targetUrl, targetMessage);
        
        res.status(200).json({ success: true, message: "Mock webhook queued" });
    } catch (error) {
        next(error);
    }
});

export default webhookRouter