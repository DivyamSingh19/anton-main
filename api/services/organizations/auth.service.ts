import prisma from "../../db/db";
import { NotFoundError, ServerError } from "../error.service";

export class AuthService{
    async findOrganization (email:string){
        try {
            const org = await prisma.organization.findFirst({
                where:{email}
            })
            if(!org){
                throw new NotFoundError("Organization not found in database")
            }
            const data = {
                email:org.email,
                username:org.name,
                id:org.id
            }
            return data
        } catch (error) {
            throw new ServerError("Could not find organization, Internal server error")
        }
    }
    async findOrganizationFromId(userId:string){
        try {
            const org = await prisma.organization.findFirst({
                where:{id:userId}
            })
            if(!org){
                throw new NotFoundError("Organization not found in the database")
            }
            const data = {
                email:org.email,
                username:org.name,
                id:org.id
            }
            return data
        } catch (error) {
            throw new ServerError("Could not find organization, Internal server error")
        }
    } 
}