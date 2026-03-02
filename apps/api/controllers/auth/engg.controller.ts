import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/error";
import { verifyPassword,hashPassword, } from "../../utils/token";


export class EnggController {
    register = async (req:Request,res:Response) => {
        try {
            const {
                email,password,name,organizationId
            } = req.body
            if(!email||!password||!name||!organizationId){
                return res.status(HTTPStatus.BadRequest).json({
                    message:"Validation failed"
                })
            }

        } catch (error) {
            return res.status(HTTPStatus.ServerError).json({
                message:"Server failed",
                data:(error as Error).message
            })
        }
    }
    login = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.ServerError).json({
                message:"Server failed",
                data:(error as Error).message
            })
        }
    }
    me = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.ServerError).json({
                message:"Server failed",
                data:(error as Error).message
            })
        }
    }
    logout= async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.ServerError).json({
                message:"Server failed",
                data:(error as Error).message
            })
        }
    }
}

