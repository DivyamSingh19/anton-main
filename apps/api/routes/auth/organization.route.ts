import express,{Request,Response,NextFunction} from "express"
import { OrganizationController } from "../../controllers/organization.controller"



const orgAdmin = express.Router()
const orgController = new OrganizationController()

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