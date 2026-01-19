import { Request,Response,NextFunction } from "express"
import { HTTPStatus } from "../utils/error"
import { decodeToken } from "../utils/token"


export const authMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.auth_token
    if(!token){
        return res.status(HTTPStatus.Unauthorized).json({
            success:false,
            message:"Auth token not found"
        })
    }
    try {
        const decoded = await decodeToken(token)
        const userId = 
        next()
    } catch (error) {
        return res.status(HTTPStatus.ServerError).json({
            success:false,
            message:(error as Error).message,
            reason:"Auth middleware failed"
        })
    }
}