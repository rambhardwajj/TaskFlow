import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodErrors";
import { validateTask } from "../validators/task.validators";
import { User } from "../models/user.models";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import { ProjectMember } from "../models/projectMember.models";
import { Task } from "../models/task.models";
import { uploadOnCloudinary } from "../configs/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

const createTask = asyncHandler(async(req: Request, res: Response) => {
    const {title , email, desc, status} = handleZodError(validateTask(req.body))

    const {projectId} = req.params

    const assignedTo = await User.findOne({email})
    if(!assignedTo){
        throw new CustomError(ResponseStatus.NotFound, "user email not found")
    }

    const assignedUserMembership = await ProjectMember.findOne({user: assignedTo, project: projectId})

    if( !assignedUserMembership){
        throw new CustomError(ResponseStatus.NotFound, "Membership not found")
    }

    const task = await Task.create({
        title, desc, assignedBy:req.user._id, assignedTo: assignedTo._id, project: projectId, status: status
    })

    if( !task) { 
        throw new CustomError(ResponseStatus.InternalServerError , "task not created")
    }

    if( !req.files){
        res.status(400)
    }
    
    const attachments  = await Promise.all((req.files as Express.Multer.File[]).map(async (file)=>{
        console.log("in attachment")
        const result = await uploadOnCloudinary(file.path)
        return {
            url: result?.secure,
            mimeType: file.mimetype,
            size: file.size
        }
    }))

    console.log("attachments" , attachments)

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success, {"task": task , "attachment": attachments}, "task created")
    )
})

export {createTask}