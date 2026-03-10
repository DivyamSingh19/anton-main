import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService as AdminAuthService } from "../../services/admins/auth.service";
import { AuthService as EngineerAuthService } from "../../services/engineer/auth.service";



export class RBACController{
    private adminAuth : AdminAuthService
    private engineerAuth : EngineerAuthService
    constructor(){
        this.adminAuth = new AdminAuthService()
        this.engineerAuth = new EngineerAuthService()
    }


    //adminUserName, projectId
    add = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
    revoke = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
    get = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}