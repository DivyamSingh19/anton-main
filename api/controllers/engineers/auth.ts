// import prisma from "../../db/db";
// import { Request,Response } from "express";
// import { HTTPStatus } from "../../utils/httpstatus";
 
// export class AuthController{
//     register = async (req:Request,res:Response) => {
//         try {
//             const {
//                 username,
//                 email,
//                 password
//             } = req.body
//             if(!username||!email||!password){
//                 return res.status(HTTPStatus.BadRequest).json({
//                     success:false,
//                     message:"Bad request"
//                 })
//             }
             
//             if(password.length<8){
//                 return res.status(HTTPStatus.BadRequest).json({
//                     success:false,
//                     message:"Password length too short"
//                 })
//             }
//             const existingEngineer = await prisma.engineer.findFirst({
//                 where:{
//                     email:email
//                 }
//             })
//             if(!existingEngineer){
//                 return res.status(HTTPStatus.Conflict).json({
//                     success:false,
//                     message:"Engineer already exists"
//                 })
//             }
//             const passwordHash = "a"
//             const createEngineer = await prisma.engineer.create({
//                 data:{
//                     email:email,
//                     password : passwordHash,

//                 }
//             })
//         } catch (error) {
//             return res.status(HTTPStatus.InternalError).json({
//                 success:false,
//                 message:(error as Error).message
//             })
//         }
//     }
//     login = async (req:Request,res:Response) => {
//         try {
            
//         } catch (error) {
//             return res.status(HTTPStatus.InternalError).json({
//                 success:false,
//                 message:(error as Error).message
//             })
//         }
//     }
//     logout = async (req:Request,res:Response) => {
//         try {
            
//         } catch (error) {
//             return res.status(HTTPStatus.InternalError).json({
//                 success:false,
//                 message:(error as Error).message
//             })
//         }
//     }
//     me = async (req:Request,res:Response) => {
//         try {
//             const engineerId = req.engineerId as string
//             if(!engineerId){
//                 return res.status(HTTPStatus.Unauthorized).json({
//                     success:false,
//                     message:"User unauthorized"
//                 })
//             }


//         } catch (error) {
//             return res.status(HTTPStatus.InternalError).json({
//                 success:false,
//                 message:(error as Error).message
//             })
//         }
//     }
// }