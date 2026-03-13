import { Request, Response } from "express";
import prisma from "../../db/db";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/user/auth.service";
import { ProjectService } from "../../services/user/project.service";
import { checkContractAddress } from "../../utils/validate.contract";

export class ProjectController {
  private userService: AuthService;
  private projectService: ProjectService;
  constructor() {
    this.userService = new AuthService();
    this.projectService = new ProjectService();
  }
  add = async (req: Request, res: Response) => {
    try {
      const { title, description, contractAddress, abi } = req.body;
      if (!title || !contractAddress || !abi) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Title, contract address and abi are required",
        });
      }
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not authenticated",
        });
      }
      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not found",
        });
      }
      const validateAddress = await checkContractAddress(contractAddress);
      if (!validateAddress.valid) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "Invalid contract provided",
        });
      }
      if (!req.body.abi || Object.keys(req.body.abi).length === 0) {
        return res.status(400).json({ message: "ABI is empty" });
      }
      const createProject = await prisma.userProjects.create({
        data: {
          title: title,
          description: description,
          contractAddress: contractAddress,
          abi: abi,
          userId: userId,
        },
      });

      return res.status(HTTPStatus.Created).json({
        success: true,
        message: "Project created successfully",
        data: {
          title: createProject.title,
          description: createProject.description,
          contractAddress: createProject.contractAddress,
        },
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  all = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not authenticated",
        });
      }
      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not found",
        });
      }
      const projects = await this.projectService.findAll(userId);
      if (projects.length === 0) {
        return res.status(HTTPStatus.Success).json({
          sucess: true,
          message: "No projects found",
          data: [],
        });
      }
      return res.status(HTTPStatus.Success).json({
        sucess: true,
        data: projects,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  edit = async (req: Request, res: Response) => {
    try {
      const { title, description, contractAddress, abi, projectId } = req.body;
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not authenticated",
        });
      }
      if (!projectId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project ID is required",
        });
      }
      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not found",
        });
      }
      const project = await this.projectService.findById(userId, projectId);
      if (!project) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project not found",
        });
      }
      if (contractAddress) {
        const validateAddress = await checkContractAddress(contractAddress);
        if (!validateAddress.valid) {
          return res.status(HTTPStatus.Notfound).json({
            success: false,
            message: "Invalid contract provided",
          });
        }
      }
      if (abi && Object.keys(abi).length === 0) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "ABI is empty",
        });
      }
      const updatedProject = await prisma.userProjects.update({
        where: {
          id: projectId,
        },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(contractAddress && { contractAddress }),
          ...(abi && { abi }),
        },
      });
      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Project updated successfully",
        data: {
          title: updatedProject.title,
          description: updatedProject.description,
          contractAddress: updatedProject.contractAddress,
        },
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  delete = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not authenticated",
        });
      }
      const { projectId } = req.body;
      if (!projectId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project ID is required",
        });
      }
      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not found",
        });
      }
      const projects = await this.projectService.findById(userId, projectId);
      if (!projects) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project not found",
        });
      }
      const deleted = await this.projectService.delete(userId, projectId);
      return res.status(HTTPStatus.Success).json({
        sucess: true,
        message: "Project deleted successfully",
        data: deleted,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  id = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not authenticated",
        });
      }
      const { projectId } = req.body;
      if (!projectId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project ID is required",
        });
      }
      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not found",
        });
      }
      const project = await this.projectService.findById(userId, projectId);
      if (!project) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project not found",
        });
      }
      return res.status(HTTPStatus.Success).json({
        sucess: true,
        message: "Project fetched successfully",
        data: project,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
  status = async (req: Request, res: Response) => {
    try {
      const { status, projectId } = req.body;
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not authenticated",
        });
      }
      if (!projectId || !status) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project ID and status are required",
        });
      }
      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "User not found",
        });
      }
      const project = await this.projectService.findById(userId, projectId);
      if (!project) {
        return res.status(HTTPStatus.BadRequest).json({
          sucess: false,
          message: "Project not found",
        });
      }
      const updated = await prisma.userProjects.update({
        where: {
          id: projectId,
        },
        data: {
          status: status,
        },
      });
      return res.status(HTTPStatus.Success).json({
        sucess: true,
        message: "Project status updated successfully",
        data: updated,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        sucess: false,
        message: (error as Error).message,
      });
    }
  };
}