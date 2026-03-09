import prisma from "../../db/db";
import { NotFoundError, ServerError } from "../error.service";

export class AuthService{
    async findOrganization (email:string){
        try {
            const admin = await prisma.admin.findFirst({
                where:{email}
            })
            if(!admin){
                throw new NotFoundError("Admin not found in database")
            }
            const data = {
                email:admin.email,
                username:admin.name,
                id:admin.id
            }
            return data
        } catch (error) {
            throw new ServerError("Could not find admin, Internal server error")
        }
    }
    async findAdminFromId(userId:string){
        try {
            const admin = await prisma.admin.findFirst({
                where:{id:userId}
            })
            if(!admin){
                throw new NotFoundError("Admin not found in the database")
            }
            const data = {
                email:admin.email,
                username:admin.name,
                id:admin.id
            }
            return data
        } catch (error) {
            throw new ServerError("Could not find admin, Internal server error")
        }
    } 
}