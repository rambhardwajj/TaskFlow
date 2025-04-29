import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import { envConfig } from "../configs/env";
import jwt from "jsonwebtoken"
import { IUser } from "../models/user.models";

const isLoggedIn = (req:Request, res:Response, next: NextFunction ) =>{
    const {accessToken} = req.cookies;

    if( !accessToken){
        throw new CustomError(ResponseStatus.Unauthorized, "Unauthorised request")
    }
    
    try {
        const decoded = jwt.verify(accessToken, envConfig.ACCESS_TOKEN_SECRET)
        req.user = decoded as IUser;
        next()
    } catch (error) {
        throw new CustomError(
            ResponseStatus.BadRequest, 
            "Invalid or expired token"
        )
    }
}

export { isLoggedIn }