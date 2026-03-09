import express,{Request,Response,NextFunction} from "express"
import { AuthController } from "../../controllers/engineers/auth"
const auth = new AuthController()
const adminAuth = express.Router()

adminAuth.post("/register",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.register(req,res)
    } catch (error) {
        next()
    }
})

adminAuth.post("/login",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.login(req,res)
    } catch (error) {
        next()
    }
})

adminAuth.post("/logout",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.logout(req,res)
    } catch (error) {
        next()
    }
})

adminAuth.get("/me",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.me(req,res)
    } catch (error) {
        next()
    }
})

export default adminAuth