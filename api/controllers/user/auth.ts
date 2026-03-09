import prisma from "../../db/db";
import { Request, Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { newUserSchema, userLoginSchema } from "../../zod/user";
import { createToken, hashPassword } from "../../utils/token";
import { AuthService } from "../../services/user/auth.service";
import { SessionService } from "../../services/user/session.service";

export class AuthController {
    private userService : AuthService
    private sessionService : SessionService
    constructor(){
        this.userService= new AuthService
        this.sessionService = new SessionService
    }
  register = async (req: Request, res: Response) => {
    try {
      const validation = newUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Validation failed",
          error: validation.error,
        });
      }
      const { username, password, email } = validation.data;

      const checkUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (checkUser) {
        return res.status(HTTPStatus.Conflict).json({
          success: false,
          message: "User already exists",
        });
      }
      const hashedPassword = await hashPassword(password);
      if (!hashedPassword) {
        return res.status(HTTPStatus.InternalError).json({
          success: false,
          message: "Internal server error",
        });
      }
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash: hashedPassword,
        },
      });
      const token = await createToken(newUser.id);
      res.cookie("user_auth_token", token, {
        httpOnly: true,
        sameSite: false,
        secure: true,
      });
      return res.status(HTTPStatus.Created).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
        token,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      const validation = userLoginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Validation failed",
          error: validation.error,
        });
      }
      const { email, password } = validation.data;
      const checkUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!checkUser) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User does not exist",
        });
      }
      const data = {
        id: checkUser.id,
        email: checkUser.email,
        username: checkUser.username,
      };
      const token = createToken(data.id);
      res.cookie("user_auth_token", token, {
        httpOnly: true,
        sameSite: false,
        secure: true,
      });
      return res.status(HTTPStatus.Success).json({
        success:true,
        message:"Login successful",
        token:token,
        data:data
      })
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
      const userId = req.userId
      if(!userId){
        return res.status(HTTPStatus.BadRequest).json({
          success:false,
          message:"Bad request login first"
        })
      }
      const user = this.userService.findUserFromId(userId) 
      if(!user){
        return res.status(HTTPStatus.Notfound).json({
          messsage:"User not found"
        })
      }
      
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  me = async (req: Request, res: Response) => {
    try {
        const userId = req.userId
        if(!userId){
          return res.status(HTTPStatus.Unauthorized).json({
            success:false,
            message:"Could not find user"
          })
        }
        const user = await this.userService.findUserFromId(userId)
        if(!user){
          return res.status(HTTPStatus.Notfound).json({
            success:false,
            message:"User not found"
          })
        }
        return res.status(HTTPStatus.Success).json({
          success:true,
          data:{
            email:user.email,
            username:user.username,
          }
        })
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}
