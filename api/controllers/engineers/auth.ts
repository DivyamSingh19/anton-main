import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { hashPassword } from "../../utils/token";
 
export class AuthController{
    register = async (req:Request,res:Response) => {
        try {
           
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })
        }
    }
    login = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })
        }
    }
    logout = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })
        }
    }
    me = async (req:Request,res:Response) => {
        try {
            const engineerId = req.engineerId as string
            if(!engineerId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"User unauthorized"
                })
            }


        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })
        }
    }
}