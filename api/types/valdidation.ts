import z,{email} from "zod"
export function validateEmail(email:string){
    const validation =  z.email(email)
    if(!validation.success){
        throw new Error("Email validation failed")
    }
    return true

}