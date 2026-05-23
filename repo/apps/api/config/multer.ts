import multer from "multer"
import { Request } from "express"

const storage = multer.diskStorage({
    filename:function(req,file:any,callback){
        callback(null,file.originalName)
    }
})


const upload = multer({
    storage
})

export default upload