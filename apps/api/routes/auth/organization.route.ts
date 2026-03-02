import express,{Request,Response,NextFunction} from "express"
import { OrganizationAuthController } from "../../controllers/auth/organization.controller"
const orgAdmin = express.Router()
const orgController = new OrganizationAuthController()

orgAdmin.get('/me',async (req:Request,res:Response,next:NextFunction) => {
    try {
        orgController.me(req,res)
    } catch (error) {
        next()
    }
})

orgAdmin.post('/register',async (req:Request,res:Response,next:NextFunction) => {
    try {
        orgController.register(req,res)
    } catch (error) {
        next()
    }
})

orgAdmin.post('/logout',async (req:Request,res:Response,next:NextFunction) => {
    try {
        orgController.logout(req,res)
    } catch (error) {
        next()
    }
})


orgAdmin.post('/login',async (req:Request,res:Response,next:NextFunction) => {
    try {
        orgController.login(req,res)
    } catch (error) {
        next()
    }
})

export default orgAdmin