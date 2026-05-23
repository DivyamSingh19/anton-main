import prisma from "../../db/db";
import { NotFoundError, ServerError } from "../error.service";

export class AuthService{
    async findEngineer (email:string){
        try {
            const engineer = await prisma.engineer.findFirst({
                where:{email}
            })
            if(!engineer){
                throw new NotFoundError("Engineer not found in database")
            }
            const data = {
                email:engineer.email,
                username:engineer.name,
                id:engineer.id
            }
            return data
        } catch (error) {
            throw new ServerError("Could not find engineer, Internal server error")
        }
    }
    async findEngineerFromId(engineerId:string){
        try {
            const engnieer = await prisma.engineer.findFirst({
                where:{id:engineerId}
            })
            if(!engnieer){
                throw new NotFoundError("Engineer not found in the database")
            }
            const data = {
                email:engnieer.email,
                username:engnieer.name,
                id:engnieer.id
            }
            return data
        } catch (error) {
            throw new ServerError("Could not find engineer, Internal server error")
        }
    } 
    async create(name:string,email:string,passwordHash:string,orgId:string){
        try {
            const createEngineer = await prisma.engineer.create({
                data:{
                    name:name,
                    email:email,
                    passwordHash:passwordHash,
                    orgId:orgId
                }
            })
            if(!createEngineer){
                throw new ServerError("Could not create user, Internal server error")
            }
            return createEngineer
        } catch (error) {
            throw new ServerError("Could not create user, internal server error")
        }
    }
}