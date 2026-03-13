//main engine to handle kill switch executions and timelocks
import express from "express"
import dotenv from "dotenv"
const app = express()
dotenv.config()
const port = process.env.PORT