import express from "express"
import cors from "cors"


const app = express()
const port = 4000

app.use(express.json())
app.use(cors())




app.listen(port,()=>{
    console.log("Server started on port:", port)
})