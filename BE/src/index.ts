import { log } from "console";
import app from "./app";
import { dbConnect } from "./configs/db";
import { envConfig } from "./configs/env";
import {logger} from "./utils/logger"



const PORT = envConfig.PORT ||  8200

dbConnect()

logger.info("Server is running in logger")
logger.error('this is logger error ')
logger.warn('There might be warning ')



app.listen(PORT, () => {
    logger.info( " server is listening on port", PORT)
})

