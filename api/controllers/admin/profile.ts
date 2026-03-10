import prisma from "../../db/db";
import { Request, Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { adminProfileSchema } from "../../zod/profile";
import { AuthService } from "../../services/admins/auth.service";
export class ProfileController {
    private orgService: AuthService
    constructor(){
        this.orgService = new AuthService()
    }
  addData = async (req: Request, res: Response) => {
    try {
        const adminId = req.adminId as string
        const validation = adminProfileSchema.safeParse(req.body)
        if(!validation.success){
            return res.status(HTTPStatus.BadRequest).json({
                success:false,
                message:"Validation failed",
                error:validation.error
            })
        }
        const {
            bio,
            headline,
         
        } = validation.data
        const vaidateOrganization = await this.orgService.findAdminFromId(adminId)
        if(!vaidateOrganization){
            return res.status(HTTPStatus.Notfound).json({
                success:false,
                message:"Organization not found"
            })
        }
        const createProfile = await prisma.adminProfile.create({
            data:{
                bio:bio,
                adminId:adminId
            }
        })
        return res.status(HTTPStatus.Created).json({
            success:true,
            message:"Bio added successfully",
            data:{
               bio: createProfile.bio
            }
        })
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  addAvatar = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
  get = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}
