import express from "express"
import dotenv from "dotenv"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors())
dotenv.config() 
const port = process.env.PORT 

declare global{
    namespace Express{
        interface Request{
            userId?:string,
            adminId?:string,
            organizationId?:string,
            engineerId?:string
        }
    }
}

//admin routes





//user routes





//engieer routes





//organization routes




app.listen(port,()=>{
    console.log("Server started on:",port)
})