import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { hasPermission, PermissionType } from "../utils/permissions";
import { Request, Response ,  NextFunction } from "express";

const checkUserPermission = (permission: PermissionType) =>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const userId  = req.user._id as string
            const projectId = req.params.projectId 

            if( !userId || !projectId ){
                throw new CustomError(ResponseStatus.BadRequest, "Missing user on project Id")
            }

            const allowed = await hasPermission(userId , projectId, permission)
            if (!allowed) {
                throw new CustomError(ResponseStatus.Forbidden, "You do not have the required permission.");
            }
           
        } catch (error) {
            throw new CustomError( ResponseStatus.Forbidden, "Permission not granted")
        }
        next()
    }
}

export {checkUserPermission}