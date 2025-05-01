import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodErrors";
import { validateSubTaskData, validateTask, validateUpdateTask } from "../validators/task.validators";
import { User } from "../models/user.models";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import { ProjectMember } from "../models/projectMember.models";
import { IAttachments, Task } from "../models/task.models";
import { uploadOnCloudinary } from "../configs/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import { SubTask } from "../models/subTask.models";
import mongoose from "mongoose";

const createTask = asyncHandler(async(req: Request, res: Response) => {
    const {title , email, desc} = handleZodError(validateTask(req.body))

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
            mimetype: file.mimetype,
            size: file.size
        }
    }))

    console.log("attachments" , attachments)

    task.attachments = attachments as IAttachments[];

    await task.save()

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success, {"task": task , "attachment": attachments}, "task created")
    )
})

const updateTask = asyncHandler(async(req: Request, res: Response)=>{
    const {title , email, desc, status} = handleZodError(validateUpdateTask(req.body))

    const {projectId, taskId} = req.params

    const existingTask = await Task.findOne({_id: taskId})
    if( !existingTask){
        throw new CustomError(ResponseStatus.NotFound, "existing task does not exists")
    }

    const assignedTo = await User.findOne({email})
    if(!assignedTo){
        throw new CustomError(ResponseStatus.NotFound, "user email not found")
    }

    const assignedUserMembership = await ProjectMember.findOne({user: assignedTo, project: projectId})
    if( !assignedUserMembership){
        throw new CustomError(ResponseStatus.NotFound, "Membership not found")
    }
    
    const updatePayload: Partial<{
        title: string;
        description: string;
        email: string;
        status: string;
    }> = {};

    if (title !== undefined) 
        updatePayload.title = title;
    if (desc !== undefined) 
        updatePayload.description = desc;
    if (email !== undefined) 
        updatePayload.email = email;
    if (status !== undefined) 
        updatePayload.status = status; 

    

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success, {}, "task created")
    )
})

const createSubTask = asyncHandler(async(req: Request, res: Response) =>{
    const {taskId, projectId} = req.params;
    const {title} = handleZodError(validateSubTaskData(req.body));
    const subTask = await SubTask.findOne({title});

    if( subTask){
        throw new CustomError(ResponseStatus.Conflict, "Subtask already exists")
    }

    const newSubTask = await SubTask.create({
        title, task: taskId, project: projectId
    })

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success,newSubTask, "Subtask Created" )
    )
})

const updateSubTask = asyncHandler(async(req: Request, res: Response) =>{
    const {subTaskId} = req.params;
    const {title, isCompleted} = handleZodError(validateSubTaskData(req.body))
    
    const updatePayload : Partial<{title: string, isCompleted:boolean}>={}
 
    if( !title)
        updatePayload.title = title;
    
    if( !subTaskId)
        updatePayload.isCompleted = isCompleted
    
    if (Object.keys(updatePayload).length === 0) {
        throw new CustomError(
          ResponseStatus.BadRequest,
          "At least one field is required to update"
        );
    }
    const updatedSubTask = await SubTask.findByIdAndUpdate( 
        subTaskId,
        updatePayload,
        {new: true}
    )

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success, updatedSubTask, "SubTask updated successfully")
    )
})

const deleteSubTask = asyncHandler(async(req: Request ,  res: Response) =>{
    const {subTaskId} = req.params

    if( !mongoose.Types.ObjectId.isValid(subTaskId)){
        throw new CustomError(ResponseStatus.BadRequest, "SubTask id doesnot exists")
    }

    const deletedTask = await SubTask.findByIdAndDelete(subTaskId);

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success, deletedTask, "subtask deleted")
    )

})

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new CustomError(ResponseStatus.BadRequest, "Task id is invalid");
  }

  const existingTask = await Task.findById(taskId);

  if (!existingTask) {
    throw new CustomError(ResponseStatus.BadRequest, "Task doesnt exist");
  }

  // session banao mongoose se  
  const session = await mongoose.startSession();
  // session start kro 
  session.startTransaction();

  try {
    await SubTask.deleteMany({ task: taskId });

    await Task.findByIdAndDelete(taskId);

    session.commitTransaction();
    res
      .status(ResponseStatus.Success)
      .json(
        new ApiResponse(
          ResponseStatus.Success,
          null,
          "Task deleted "
        )
      );

  } catch (error: any) {

    session.abortTransaction();

    throw new CustomError(
      ResponseStatus.InternalServerError,
      `Error while deleting task: ${error.message}`
    );

  } finally {
    session.endSession();
  }
});

const getTaskById = asyncHandler(async( req: Request, res: Response) =>{
    const { taskId, projectId} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(taskId)){
        throw new CustomError(ResponseStatus.BadRequest, "taskId does not exists");
    }

    const task = await Task.aggregate([
        {
            $match: {
                $and:[
                    {user : new mongoose.Types.ObjectId(taskId as string)},
                    {project: new mongoose.Types.ObjectId(projectId as string)},
                ]
            }
        },
        {
            $lookup:{
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "$projectInfo"
            }
        },
        {
            $lookup:{
                from: "tasks",
                localField: "task",
                foreignField: "_id",
                as: "$taskInfo"
            }
        }
       
    ])

    res.status(200).json(
        new ApiResponse(ResponseStatus.Success, task, "task returned")
    )
})

const getTasks = asyncHandler(async(req: Request, res: Response) =>{
    const {projectId} = req.params

    if( mongoose.Types.ObjectId.isValid(projectId)){
        throw new CustomError(ResponseStatus.BadRequest, "invalid projectId")
    }

    const allTasks = await Task.aggregate([
        {
            $match: {
                tasks : new mongoose.Types.ObjectId(projectId as string)
            }
        },
        
    ])

    res.status(200).json(
        new ApiResponse( ResponseStatus.Success, allTasks, "all tasks returned" )
    )
})

export {createTask,
    deleteTask,
    updateTask,
    getTasks,
    getTaskById,
    createSubTask,
    deleteSubTask,
    updateSubTask,
}