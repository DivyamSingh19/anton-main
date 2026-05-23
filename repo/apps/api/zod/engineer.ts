import z, { email } from "zod";

const passwordSchema = z.string().min(8,{message:"Password must contain atleast 8 characters"})
const usernameSchema = z.string().min(8,{
    message:"Username must be atleast 8 characters"
}).max(20,{
    message:"Username can not be more than 20 characters"
})
const engineerSchema = z.object({
    id:z.string().uuid(),
    email:z.email(),
    password:passwordSchema,
    username:usernameSchema
})

const engineerLoginSchema = z.object({
    email:z.email(),
    password:passwordSchema
})

const newEngineerSchema = z.object({
    username:usernameSchema,//indexing
    email:z.email(),
    password:passwordSchema
})

export {
    engineerSchema,
    newEngineerSchema,
    engineerLoginSchema,
}