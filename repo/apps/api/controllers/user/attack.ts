import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";


export class AttackController{
    getAttackData = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({

            })
        }
    }
}