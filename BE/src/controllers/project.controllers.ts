import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreateProjectData } from "../validators/project.validators";
import { handleZodError } from "../utils/handleZodErrors";
import { Project } from "../models/project.models";
import { ApiResponse } from "../utils/ApiResponse";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { ProjectMember } from "../models/projectMember.models";
import mongoose from "mongoose";


const createProject = asyncHandler(async (req: Request, res:Response ) =>{
    const {name, desc} = handleZodError(validateCreateProjectData(req.body))
    const clientSession = await mongoose.startSession();
    clientSession.startTransaction();
    try {
        let project = await Project.create({name, desc, createdBy: req.user._id})
        let projectMember = await ProjectMember.create({ user: project.createdBy, project: project, role: "owner" } )     
        await clientSession.commitTransaction();
    } catch (error) {
        await clientSession.endSession();
        throw new CustomError(ResponseStatus.InternalServerError, "Transaction Failed")
    }
    await clientSession.endSession();

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

// pagination yet to be implemented
const getProjects = asyncHandler(async (req: Request, res: Response) =>{
    const userId = req.user._id
    if( !userId) {
        throw new CustomError(ResponseStatus.NotFound, " User not found")
    }

    // { { id, proj }, { id, proj:  }, } 
    // .populate will populate the object of project in the membership object
    const allProjectMemberships = await ProjectMember.find( { user: userId }).populate('project')

    const projects = allProjectMemberships.map( (membership) => membership.project)

    if(!projects || projects.length==0){
        throw new CustomError(ResponseStatus.NotFound, "Projects not found") 
    }

    res.status(200).json(
        new ApiResponse( ResponseStatus.Success, projects ,"Projects populated")
    )
})

const getProjectById = asyncHandler(async (req : Request, res: Response)=>{
    
})


const updateProject = asyncHandler(async (req: Request, res:Response ) =>{

})


export {createProject, getProjects}