import mongoose from "mongoose";
import { envConfig } from "./env";
import { logger } from "../utils/logger";

const dbConnect = async () =>{
    try {
        await mongoose.connect(envConfig.MONGO_URI)
        console.log("mongodb connected successfully ")
    } catch (error) {
        if( error instanceof Error){
            logger.error("Error in mongodb connection", error.message)
        }else{
            logger.error("unknown error in db connection" , error)
        }
        process.exit(1);
    }
} 

export {dbConnect}