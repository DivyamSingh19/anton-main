import prisma from "../db/db";
import { ServerError } from "./error.service";


export class WalletService{
    async add(wallet:string,signature:string){
        try {
            
        } catch (error) {
            throw new ServerError("Internal server error could not add wallet")
        }
    }
}