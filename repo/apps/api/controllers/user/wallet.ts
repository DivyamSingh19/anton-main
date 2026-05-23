import prisma from "../../db/db";
import { AuthService } from "../../services/user/auth.service";
import { HTTPStatus } from "../../utils/httpstatus";
import { Request,Response } from "express";

export class WalletController{
    private userService:AuthService
    constructor(){
        this.userService = new AuthService()
    }
    add = async (req:Request,res:Response) => {
        try {
            const userId = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"Not authorized to perform action"
                })
            }
            const {walletAddress,txId} = req.body
            if(!walletAddress || !txId){
                return res.status(HTTPStatus.BadRequest).json({
                    sucess:false,
                    message:"Bad request"
                })
            }
            const user = await this.userService.findUserFromId(userId)
            if(!user){
                return res.status(HTTPStatus.Notfound).json({
                    success:false,
                    message:"User not found"
                })
            }
            const existingWallet = await prisma.userWallets.findFirst({
                where:{
                    walletAddress:walletAddress
                }
            })
            if(walletAddress){
                return res.status(HTTPStatus.Conflict).json({
                    success:false,
                    message:"Wallet already exists, try a different wallet"
                })
            }
            // const addWallet = await prisma.userWallets.create({
            //     data:{
            //         userId:userId,
            //         walletAddress:walletAddress
            //     }
            // })
            return res.status(HTTPStatus.Created).json({
                success:true,
                messasge:"Wallet added successfully",
                data:{
                    address:walletAddress
                }
            })
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })
        }
    }
    update = async (req:Request,res:Response) => {
        try {
            const userId = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"Not authorized to perform action"
                })
            }
            const { newWalletAddress,txId} = req.body
            if(!newWalletAddress || !txId){
                return res.status(HTTPStatus.BadRequest).json({
                    sucess:false,
                    message:"Bad request"
                })
            }
            const user = await this.userService.findUserFromId(userId)
            if(!user){
                return res.status(HTTPStatus.Notfound).json({
                    success:false,
                    message:"User not found"
                })
            }
            const existingWallet = await prisma.userWallets.findFirst({
                where:{
                    walletAddress:newWalletAddress
                }
            })
            if(newWalletAddress){
                return res.status(HTTPStatus.Conflict).json({
                    success:false,
                    message:"Wallet already exists, try a different wallet"
                })
            }
            const addWallet = await prisma.userWallets.update({
                where:{
                    userId:userId
                },
                data:{
                    walletAddress:newWalletAddress
                }
            })
            return res.status(HTTPStatus.Created).json({
                success:true,
                messasge:"Wallet updated successfully",
                data:{
                    address:newWalletAddress
                }
            })
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json(
                {
                    success:false,
                    message:(error as Error).message
                }
            )
        }
    }
}