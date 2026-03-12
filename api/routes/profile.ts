import express,{ Request,Response,NextFunction } from "express";
 
import { ProfileController } from "../controllers/user/profile";

const profileRouter = express.Router()
const controller = new ProfileController()




export default profileRouter