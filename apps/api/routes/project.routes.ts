import express,{Request,Response,NextFunction} from "express"
import { ProjectController } from "../controllers/project.controller"


const router = express.Router()
const project = new ProjectController



export default router