import express,{ Request,Response,NextFunction } from "express";
import { EnggController } from "../controllers/engg.controller";



const router = express.Router()
const engg = new EnggController()





export default router