import prisma from "../../db/db";
import { Request, Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { organizationProfileSchema } from "../../zod/profile";
export class ProfileController {
  add = async (req: Request, res: Response) => {
    try {
        const validation = organizationProfileSchema.safeParse(req.body)
        if(!validation.success){
            return res.status(HTTPStatus.BadRequest).json({
                success:false,
                message:"Validation failed",
                error:validation.error
            })
        }
        
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
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
