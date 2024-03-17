import mongoose from "mongoose";
import { DB_NAME } from "../constants"


const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        console.log(`\n MongoDB connected! Db host:${connectionInstance.connection.host}\n`)
    }
    catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
        
    }
    

}


export default connectDB;