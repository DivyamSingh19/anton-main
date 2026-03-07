import express from "express"
import dotenv from "dotenv"

const app = express()

app.use(express.json())
dotenv.config()


app.listen(4000)