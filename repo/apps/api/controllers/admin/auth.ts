import prisma from "../../db/db";
import { Request, Response } from "express";
import { AuthService } from "../../services/admins/auth.service";
import { SessionService } from "../../services/admins/session.service";
import { HTTPStatus } from "../../utils/httpstatus";
export class AuthController {
  private authService: AuthService;
  private sessionService: SessionService;
  constructor() {
    this.authService = new AuthService();
    this.sessionService = new SessionService();
  }
  register = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  login = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  me = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}
