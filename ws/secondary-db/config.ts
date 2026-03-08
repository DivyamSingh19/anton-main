import mongoose from "mongoose";

const connectDB =  mongoose.connect(process.env.DB_URI as string)

export default connectDB