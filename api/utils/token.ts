import JWT from "jsonwebtoken";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config()

const createToken = async (id:string) => {
    return JWT.sign({id},process.env.JWT_SECRET as string)
}

const validateToken = async (token:string) => {
    return JWT.verify(token,process.env.JWT_SECRET as string)
}
const hashPassword = async (password:string) => {
    const saltrounds = 14
    return bcrypt.hash(password,saltrounds)
}
const validatePassword = async (password:string,hashedpassword:string) => {
    return bcrypt.compare(password,hashedpassword)
}

export {
    createToken,
    validateToken,
    hashPassword,
    validatePassword
}