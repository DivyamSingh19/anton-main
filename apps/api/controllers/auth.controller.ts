import { Request,Response } from "express";
import { HTTPStatus } from "../utils/error";
import { BadRequestError } from "../services/error.service";
import { UserService } from "../services/user.service";

export class AuthController{
    private userService : UserService
    constructor(){
        this.userService = new UserService
    }
    register = async (req:Request,res:Response) => {
        try {
            const {email,password,name} = req.body
            if(!email||!password||!name){
                throw new BadRequestError("Validation failed")
            }
            const verifyUser = this.userService.findUser
        } catch (error) {
            
        }
    }
    login = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
    logout = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
    me = async (req:Request,res:Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}