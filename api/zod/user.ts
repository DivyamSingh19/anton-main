import z, { email } from "zod";

const passwordSchema = z.string().min(8,{message:"Password must contain atleast 8 characters"})
const usernameSchema = z.string().min(8,{
    message:"Username must be atleast 8 characters"
}).max(20,{
    message:"Username can not be more than 20 characters"
})
const userSchema = z.object({
    id:z.string().uuid(),
    email:z.email(),
    password:passwordSchema,
    username:usernameSchema
})

const userLoginSchema = z.object({
    email:z.email(),
    password:passwordSchema
})

const newUserSchema = z.object({
    username:usernameSchema,//indexing
    email:z.email(),
    password:passwordSchema
})

export {
    userSchema,
    newUserSchema,
    userLoginSchema,
}