import { Response , Request, NextFunction } from "express"
import { CustomError } from "../utils/CustomError"
import { ResponseStatus } from "../utils/constants"

const errorHandler = ( error : any, req: Request, res: Response , next : NextFunction) =>{
    let customError : CustomError

    if( error instanceof CustomError ){
        customError = error 
    }else{
        // custom error banado
        customError = new CustomError( error.message, ResponseStatus.InternalServerError )
    }
    res.status(customError.statusCode).json({
        success: false, 
        message: customError.message,
        data: customError.data,
        statusCode: customError.statusCode
    })
}

export {errorHandler}