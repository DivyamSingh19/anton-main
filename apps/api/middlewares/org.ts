import { Request,Response,NextFunction} from "express";
import { HTTPStatus } from "../utils/error";



export const orgAuthMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.org_admin_token
   
    try {
        
    } catch (error) {
        
    }
}

export const orgEnggMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.org_engg_token
    if(!token) return res.status(HTTPStatus.Unauthorized).json({success:false,message:"Not a member of the organization"})
    try {
        
    } catch (error) {
        return res.status(HTTPStatus.ServerError).json({
            success:false,
            message:"Internal server error in engineer validation"
        })
    }
}