import "dotenv/config"
import {PrismaPg} from "@prisma/adapter-pg"
import {PrismaClient} from "./generated/client/index"
const connectionString = process.env.DATABASE_URL

if(!connectionString){
    throw new Error("Database url is not defined")
}

const adapter = new PrismaPg({
    connectionString
})

const prisma = new PrismaClient({adapter})

export {prisma}