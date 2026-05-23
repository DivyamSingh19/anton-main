import prisma from "../../db/db";
import { NotFoundError, ServerError } from "../error.service";
export class SessionService{
    async findSession(adminId:string){
        try {
            const session = await prisma.adminSessions.findFirst({
                where:{
                    adminId:adminId
                }
            })
            if(!session){
                throw new NotFoundError("Sesison not found")
            }
            return session
        } catch (error) {
            throw new ServerError("Sesison not found,Internal server error")
        }
    }
}