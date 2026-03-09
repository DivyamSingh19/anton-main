import { AuthController } from "../../controllers/user/auth";
import express,{Request,Response,NextFunction} from "express"


const auth = new AuthController()
const userAuth = express.Router()



userAuth.post("/register",auth.register)

export default userAuth