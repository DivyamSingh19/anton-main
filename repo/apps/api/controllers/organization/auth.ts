import prisma from "../../db/db";
import { Request, Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/organizations/auth.service";
import { SessionService } from "../../services/organizations/session.service";
import { hashPassword,createToken,validatePassword } from "../../utils/token";
export class AuthController {
  private sessionService: SessionService;
  private authService: AuthService;
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
