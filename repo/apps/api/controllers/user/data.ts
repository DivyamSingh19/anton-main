import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/user/auth.service";
import { ProjectService } from "../../services/user/project.service";

export class DataController{
    private authService:AuthService
    private projectService: ProjectService
    constructor(){
        this.authService = new AuthService
        this.projectService = new ProjectService
    }   
    allProjects = async (req:Request,res:Response) => {
        try {
            const userId = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"User not authorized"
                })
            }
            const user = await this.authService.findUserFromId(userId)
            if(!user){
                return res.status(HTTPStatus.Notfound).json({
                    success:false,
                    message:"User not found"
                })
            }
            const projects = await prisma.userProjects.findMany({
                where:{
                    userId:userId
                }
            })
            if(projects.length == 0){
                return res.status(HTTPStatus.Notfound).json({
                    success:false,
                    message:"Projects not found, create first"
                })
            }
            return res.status(HTTPStatus.Success).json({
                success:true,
                message:"Project fetching successful",
                data:{
                    projects
                }
            })
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })   
        }
    }
}