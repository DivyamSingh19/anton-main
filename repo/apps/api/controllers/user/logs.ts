//goal => fetch logs and show them on the frontend

import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";



export class LogController{
    getLogs = async (req:Request,res:Response) => {
        try {
            const {projectId} = req.body
            if(!projectId){
                return res.status(HTTPStatus.BadRequest).json({
                    success:false,
                    message:"Project id not provided"
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