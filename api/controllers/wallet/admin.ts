import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
export class Wallet{
    add = async (req:Request,res:Response) => {
        try {
            const {
                walletAddress,
                signature,
                adminId,
                orgId
            } = req.body
            if(!walletAddress||!signature||!adminId||!orgId){
                return res.status(HTTPStatus.BadRequest).json({
                    success:false,
                    message:"Incomplete data"
                })
            }
        } catch (error) {
            
        }
    }
    update = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
    remove = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}