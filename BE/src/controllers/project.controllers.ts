import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreateProjectData } from "../validators/project.validators";
import { handleZodError } from "../utils/handleZodErrors";
import { Project } from "../models/project.models";
import { ApiResponse } from "../utils/ApiResponse";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";


const createProject = asyncHandler(async (req: Request, res:Response ) =>{
    const {name, desc, createdBy} = handleZodError(validateCreateProjectData(req.body))

    const existingProject = await Project.findOne({name})

    if(existingProject){
        throw new CustomError(ResponseStatus.Conflict, "Project already exist")
    }

    
    
})