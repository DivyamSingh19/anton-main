import { AuthController } from "../controllers/user/auth";
import express,{Request,Response,NextFunction} from "express"
import { userAuthMiddleware } from "../middlewares/auth/user";


const auth = new AuthController()
const userAuth = express.Router()

userAuth.post("/register",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.register(req,res)
    } catch (error) {
        next()
    }
})

userAuth.post("/login",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.login(req,res)
    } catch (error) {
        next()
    }
})

userAuth.post("/logout",async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.logout(req,res)
    } catch (error) {
        next()
    }
})

userAuth.get("/me",userAuthMiddleware,async (req:Request,res:Response,next:NextFunction) => {
    try {
        auth.me(req,res)
    } catch (error) {
        next()
    }
})

export default userAuth 