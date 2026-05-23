//main engine to handle kill switch executions and timelocks
import express from "express"
import dotenv from "dotenv"
import connectDB from "./mongo/connection"
const app = express()
dotenv.config()
const port = process.env.PORT

connectDB()




app.listen(port,()=>{
    console.log(`Kaizen Engine running on port ${port}`)
})