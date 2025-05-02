import { Response , Request, NextFunction } from "express"
import { CustomError } from "../utils/CustomError"
import { ResponseStatus } from "../utils/constants"
import { logger } from "../utils/logger"

const errorHandler = ( error : any, req: Request, res: Response , next : NextFunction) =>{
    let customError : CustomError

    if( error instanceof CustomError ){
        customError = error 
    }else if(error.code === 11000){
        const field = Object.keys(error.keyValue)[0];
        customError = new CustomError(409, `Duplicate value for field: ${field}`);
    }else{
        customError = new CustomError( ResponseStatus.InternalServerError, error.message,  )
    }



    logger.error("errorHandler Middleware executed", error.message)
    res.status(customError.statusCode).json({
        success: false, 
        message: customError.message,
        data: customError.data,
        statusCode: customError.statusCode
    })
}

export {errorHandler}