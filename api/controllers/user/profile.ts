import prisma from "../../db/db";
import { Request, Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/user/auth.service";

export class ProfileController {
  private userService: AuthService;

  constructor() {
    this.userService = new AuthService();
  }

  get = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not found",
        });
      }

      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "Profile not found",
        });
      }

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Profile fetched successfully",
        data: profile,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not found",
        });
      }

      const existing = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (existing) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Profile already exists, use edit instead",
        });
      }

      const { bio, avatarUrl, headLine } = req.body;

      const profile = await prisma.userProfile.create({
        data: {
          userId,
          bio,
          avatarUrl,
          headLine,
        },
      });

      return res.status(HTTPStatus.Created).json({
        success: true,
        message: "Profile created successfully",
        data: profile,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not found",
        });
      }

      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "Profile not found, create one first",
        });
      }

      const { bio, avatarUrl, headLine } = req.body;

      if (!bio && !avatarUrl && !headLine) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "At least one field is required to update",
        });
      }

      const updated = await prisma.userProfile.update({
        where: { userId },
        data: {
          ...(bio && { bio }),
          ...(avatarUrl && { avatarUrl }),
          ...(headLine && { headLine }),
        },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Profile updated successfully",
        data: updated,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "User not found",
        });
      }

      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "Profile not found",
        });
      }

      const deleted = await prisma.userProfile.delete({
        where: { userId },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Profile deleted successfully",
        data: deleted,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}