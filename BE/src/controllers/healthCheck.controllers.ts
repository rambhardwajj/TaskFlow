
import { Request , Response } from "express"
import { ApiResponse } from "../utils/ApiResponse"
import { envConfig } from "../configs/env"

const healthCheck = ( req: Request, res:Response ) => {
    res.status(200).json(new ApiResponse(200, {}, "health check passed"))
}

export { healthCheck }

