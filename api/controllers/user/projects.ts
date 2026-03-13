import { Request, Response } from "express";
import prisma from "../../db/db";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/user/auth.service";
import { ProjectService } from "../../services/user/project.service";

export class ProjectController {
    private userService:AuthService         
    private projectService:ProjectService
    constructor(){
        this.userService = new AuthService()
        this.projectService = new ProjectService()
    }
  add = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  all = async (req: Request, res: Response) => {
    try {
        const userId = req.userId
        if(!userId){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not authenticated"
            })
        }
        const user = await this.userService.findUserFromId(userId)
        if(!user){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not found"
            })
        }
        const projects = await this.projectService.findAll(userId)
        if(projects.length === 0){
            return res.status(HTTPStatus.Success).json({
                sucess: true,   
                message: "No projects found",
                data: []
            })
        }
        return res.status(HTTPStatus.Success).json({
            sucess: true,
            data: projects
        })
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  edit = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  delete = async (req: Request, res: Response) => {
    try {
        const userId = req.userId
        if(!userId){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not authenticated"
            })
        }
        const {projectId}= req.body
        if(!projectId){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "Project ID is required"
            })
        }
        const user = await this.userService.findUserFromId(userId)
        if(!user){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not found"
            })
        }
        const projects = await this.projectService.findById(userId, projectId)
        if(!projects){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "Project not found"
            })
        }
        const deleted = await this.projectService.delete(userId, projectId)
        return res.status(HTTPStatus.Success).json({
            sucess: true,
            message: "Project deleted successfully",
            data: deleted
        })
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  id = async (req: Request, res: Response) => {
    try {
        const userId = req.userId
        if(!userId){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not authenticated"
            })
        }
        const {projectId}= req.body
        if(!projectId){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "Project ID is required"
            })
        }
        const user = await this.userService.findUserFromId(userId)
        if(!user){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not found"
            })
        }
        const projects = await this.projectService.findById(userId, projectId)
        if(!projects){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "Project not found"
            })
        }
        return 
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  status = async (req:Request,res:Response) => {
    try {
        const {status, projectId} = req.body
        const userId = req.userId
        if(!userId){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not authenticated"
            })
        }
        if(!projectId || !status){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "Project ID and status are required"
            })
        }
        const user = await this.userService.findUserFromId(userId)
        if(!user){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "User not found"
            })
        }
        const project = await this.projectService.findById(userId, projectId)
        if(!project){
            return res.status(HTTPStatus.BadRequest).json({
                sucess: false,
                message: "Project not found"
            })
        }
        const updated = await prisma.userProjects.update({
            where: {
                id: projectId,
            },
            data: {
                status:status   
            }
        })
        return res.status(HTTPStatus.Success).json({
            sucess: true,
            message: "Project status updated successfully",
            data: updated
        })
    } catch (error) {
        return res.status(HTTPStatus.InternalError).json({
            sucess: false,
            message: (error as Error).message,
        })
    }
  }
}
