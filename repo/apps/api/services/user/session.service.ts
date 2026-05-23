import prisma from "../../db/db";
import { NotFoundError, ServerError } from "../error.service";
export class SessionService {
    async findSession(token: string) {
        try {
            const session = await prisma.userSessions.findUnique({
                where: {
                    sessionToken: token
                }
            })
            if (!session) {
                throw new NotFoundError("Session not found")
            }
            return session
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new ServerError("Session not found, Internal server error")
        }
    }

    async createSession(userId: string, token: string) {
        try {
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

            const session = await prisma.userSessions.create({
                data: {
                    userId,
                    sessionToken: token,
                    lastLogin: new Date(),
                    expiresAt: expiresAt
                }
            })
            return session
        } catch (error) {
            throw new ServerError("Could not create session, Internal server error")
        }
    }

    async invalidateSession(token: string) {
        try {
            await prisma.userSessions.delete({
                where: {
                    sessionToken: token
                }
            })
            return true
        } catch (error) {
            throw new ServerError("Could not invalidate session, Internal server error")
        }
    }
}
