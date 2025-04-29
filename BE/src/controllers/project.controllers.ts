import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreateProjectData } from "../validators/project.validators";
import { handleZodError } from "../utils/handleZodErrors";
import { Project } from "../models/project.models";
import { ApiResponse } from "../utils/ApiResponse";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { ProjectMember } from "../models/projectMember.models";
import { User } from "../models/user.models";


const createProject = asyncHandler(async (req: Request, res:Response ) =>{
    const {name, desc, createdBy} = handleZodError(validateCreateProjectData(req.body))

    let project = await Project.create({name, desc, createdBy})
    if( !project){
        throw new CustomError(ResponseStatus.InternalServerError, "Project creation failed due to internal server")
    }
    
    let projectMember = await ProjectMember.create({ user: project.createdBy, project: project, role: "owner" } ) 

    if(!projectMember){
        throw new CustomError(ResponseStatus.InternalServerError, "Owner creation failed")
    }

    res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        {},
        "Project created successfully. User is the owner of the created Project"
      )
    );

})




export {createProject}