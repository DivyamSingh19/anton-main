import { Request, Response } from "express";
import { HTTPStatus } from "../utils/error";

export class ProjectController {
  addProject = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User id not found",
        });
      }
    } catch (error) {
      return res.status(HTTPStatus.ServerError).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
  editProject = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User id not found",
        });
      }
    } catch (error) {
      return res.status(HTTPStatus.ServerError).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
  removeProject = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User id not found",
        });
      }
    } catch (error) {
      return res.status(HTTPStatus.ServerError).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
  getProjectById = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User id not found",
        });
      }
    } catch (error) {
      return res.status(HTTPStatus.ServerError).json({
        success: false,
        error: (error as Error).message,
        message: "Server error in getting the project by Id",
      });
    }
  };
  getAllProjects = async (req: Request, res: Response) => {
    try {
      //projects of the user
    } catch (error) {
      return res.status(HTTPStatus.ServerError).json({
        success: false,
        error: (error as Error).message,
        message: "Server error in getting all Projects",
      });
    }
  };
}
