import express,{ Request,Response,NextFunction } from "express";
import { EnggController } from "../../controllers/engg.controller";



const router = express.Router()
const engg = new EnggController()

router.post('/',async (req:Request,res:Response,next:NextFunction) => {
    try {
        
    } catch (error) {
        next()
    }
})


router.post('/',async (req:Request,res:Response,next:NextFunction) => {
    try {
        
    } catch (error) {
        next()
    }
})


router.post('/',async (req:Request,res:Response,next:NextFunction) => {
    try {
        
    } catch (error) {
        next()
    }
})


router.post('/',async (req:Request,res:Response,next:NextFunction) => {
    try {
        
    } catch (error) {
        next()
    }
})


export default router