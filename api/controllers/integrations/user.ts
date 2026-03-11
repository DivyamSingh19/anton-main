import prisma from "../../db/db";
import { Request, Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/user/auth.service";

export class WebhookController {
  private userService: AuthService;
  constructor() {
    this.userService = new AuthService();
  }

  discord = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized to perform this action",
        });
      }

      const { url } = req.body;

      if (!url) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Discord webhook URL is required",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User not found",
        });
      }

      // Precheck: see if a discord webhook already exists for this user
      const existing = await prisma.userWebHooks.findFirst({
        where: { userId, discordUrl: { not: null } },
      });

      if (existing) {
        return res.status(HTTPStatus.Conflict).json({
          success: false,
          message: "Discord webhook already exists. Use update instead.",
        });
      }

      const addDiscordWebHook = await prisma.userWebHooks.create({
        data: {
          userId,
          discordUrl: url,
        },
      });

      return res.status(HTTPStatus.Created).json({
        success: true,
        message: "Discord webhook created successfully",
        url,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  slack = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized to perform this action",
        });
      }

      const { url } = req.body;

      if (!url) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Slack webhook URL is required",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User not found",
        });
      }

      // Precheck: see if a slack webhook already exists for this user
      const existing = await prisma.userWebHooks.findFirst({
        where: { userId, slackurl: { not: null } },
      });

      if (existing) {
        return res.status(HTTPStatus.Conflict).json({
          success: false,
          message: "Slack webhook already exists. Use update instead.",
        });
      }

      const addSlackWebHook = await prisma.userWebHooks.create({
        data: {
          userId,
          slackurl: url,
        },
      });

      return res.status(HTTPStatus.Created).json({
        success: true,
        message: "Slack webhook created successfully",
        url,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  removeSlack = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized to perform this action",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User not found",
        });
      }

      // Precheck: see if a slack webhook exists before deleting
      const existing = await prisma.userWebHooks.findFirst({
        where: { userId, slackurl: { not: null } },
      });

      if (!existing) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "No Slack webhook found for this user",
        });
      }

      await prisma.userWebHooks.update({
        where: { id: existing.id },
        data: { slackurl: null },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Slack webhook removed successfully",
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  removeDiscord = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized to perform this action",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User not found",
        });
      }

      // Precheck: see if a discord webhook exists before deleting
      const existing = await prisma.userWebHooks.findFirst({
        where: { userId, discordUrl: { not: null } },
      });

      if (!existing) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "No Discord webhook found for this user",
        });
      }

      await prisma.userWebHooks.update({
        where: { id: existing.id },
        data: { discordUrl: null },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Discord webhook removed successfully",
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  updateDiscord = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized to perform this action",
        });
      }

      const { url } = req.body;

      if (!url) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "New Discord webhook URL is required",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User not found",
        });
      }

      // Precheck: discord webhook must exist before updating
      const existing = await prisma.userWebHooks.findFirst({
        where: { userId, discordUrl: { not: null } },
      });

      if (!existing) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "No Discord webhook found for this user. Create one first.",
        });
      }

      const updated = await prisma.userWebHooks.update({
        where: { id: existing.id },
        data: { discordUrl: url },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Discord webhook updated successfully",
        url,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  updateSlack = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized to perform this action",
        });
      }

      const { url } = req.body;

      if (!url) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "New Slack webhook URL is required",
        });
      }

      const user = await this.userService.findUserFromId(userId);
      if (!user) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "User not found",
        });
      }

       
      const existing = await prisma.userWebHooks.findFirst({
        where: { userId, slackurl: { not: null } },
      });

      if (!existing) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "No Slack webhook found for this user. Create one first.",
        });
      }

      const updated = await prisma.userWebHooks.update({
        where: { id: existing.id },
        data: { slackurl: url },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Slack webhook updated successfully",
        url,
      });
    } catch (error) {
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}