import { Request,Response,NextFunction } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { validateToken } from "../../utils/token";
export const enggAuthMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.engg_auth_token
    if(!token){
        return res.status(HTTPStatus.Unauthorized).json({
            success:false,
            message:"Not authorized"
        })
    } 
    try {
        const decoded = await validateToken(token)
        req.engineerId = decoded as string
        next()
    } catch (error) {
        return res.status(HTTPStatus.InternalError).json({
            success:false,
            message:(error as Error).message
        })
    }
}