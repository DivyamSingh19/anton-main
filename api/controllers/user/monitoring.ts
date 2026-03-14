import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";


export class MonitoringController{
    start = async (req:Request,res:Response) => {
        try {
            const userId = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"User not authorized"
                })
            }
            const {projectId} = req.body
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                error:(error as Error).message
            })
        }
    }
    view = async (req:Request,res:Response) => {
        try {
            const userId  = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"User not authorized"
                })
            }
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                error:(error as Error).message
            })
        }
    }    
}