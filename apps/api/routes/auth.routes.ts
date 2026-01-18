import express,{Request,Response,NextFunction} from "express"
import { AuthController } from "../controllers/auth.controller"


const router = express.Router()
const auth = new AuthController()

router.get('/me',async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.me(req,res)
    } catch (error) {
        next()
    }
})

router.post('/register',async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.register(req,res)
    } catch (error) {
        next()
    }
})

router.post('/login',async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.login(req,res)
    } catch (error) {
        next()
    }
})

router.post('/logout',async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.logout(req,res)
    } catch (error) {
        next()
    }
})


export default router