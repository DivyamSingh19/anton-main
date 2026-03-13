import mongoose from "mongoose";
const dbUri = process.env.MONGODB_URI
 
const connectDB = async () => {
    mongoose.connection.on('connected',()=>{
        console.log("DB connected")
    })
    await mongoose.connect(`${dbUri as string}/kaizen`)
}

export default connectDB;