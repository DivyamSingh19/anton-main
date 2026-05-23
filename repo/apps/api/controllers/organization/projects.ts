import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { ProjectService } from "../../services/organizations/project.service";

export class ProjectDataController{
    private projectService:ProjectService
    constructor(){
        this.projectService= new ProjectService()
    }
    fetchProjects = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                message:(error as Error).message
            })
        }
    }
}