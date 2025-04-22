import mongoose from "mongoose";
import { envConfig } from "./env";

const dbConnect = async () =>{
    try {
        await mongoose.connect(envConfig.MONGO_URI)
        console.log("mongodb connected successfully ")
    } catch (error) {
        if( error instanceof Error){
            console.log("Error in mongodb connection", error.message)
        }else{
            console.log("unknown error in db connection" , error)
        }
        process.exit(1);
    }
} 

export {dbConnect}