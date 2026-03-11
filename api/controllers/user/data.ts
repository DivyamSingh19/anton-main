import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";
import { AuthService } from "../../services/user/auth.service";
import { ProjectService } from "../../services/user/project.service";

export class DataController{
    private authService:AuthService
    private projectService: ProjectService
    constructor(){
        this.authService = new AuthService
        this.projectService = new ProjectService
    }   
}