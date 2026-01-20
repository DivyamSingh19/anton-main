import prisma from "@repo/db";
import { ServerError } from "./error.service";


export class UserService{
    async findUser(userId:string){
        try {
            const response = await prisma.users
        } catch (error) {
            throw new ServerError("Could not find user")
        }
    }
    async getUserData(userId:string){
        try {
            
        } catch (error) {
            throw new ServerError("Could not get user data")
        }
    }
    async checkUser(email:string){
        try {
            const status = await prisma.users
        } catch (error) {
            throw new ServerError("Could not check user")
        }
    }
}