import { Request, Response, NextFunction } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { validateToken } from "../../utils/token";
import prisma from "../../db/db";

export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.user_auth_token;
    if (!token) {
        return res.status(HTTPStatus.Unauthorized).json({
            success: false,
            message: "Not authorized"
        });
    }
    try {
        const decoded = (await validateToken(token)) as { id: string };

        // Validate session in database
        const session = await prisma.userSessions.findUnique({
            where: {
                sessionToken: token
            }
        });

        if (!session || session.expiresAt < new Date()) {
            return res.status(HTTPStatus.Unauthorized).json({
                success: false,
                message: "Session expired or invalid"
            });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(HTTPStatus.Unauthorized).json({
            success: false,
            message: "Invalid token"
        });
    }
};