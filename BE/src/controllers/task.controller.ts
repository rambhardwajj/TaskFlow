import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodErrors";
import {
  validateSubTaskData,
  validateTask,
  validateUpdateTask,
} from "../validators/task.validators";
import { User } from "../models/user.models";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import { ProjectMember } from "../models/projectMember.models";
import { IAttachments, Task } from "../models/task.models";
import { uploadOnCloudinary } from "../configs/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import { SubTask } from "../models/subTask.models";
import mongoose from "mongoose";

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, email, desc } = handleZodError(validateTask(req.body));

  const { projectId } = req.params;
  const assignedTo = await User.findOne({ email });
  if (!assignedTo) {
    throw new CustomError(ResponseStatus.NotFound, "user email not found");
  }
  const assignedUserMembership = await ProjectMember.findOne({
    user: assignedTo,
    project: projectId,
  });

  if (!assignedUserMembership) {
    throw new CustomError(ResponseStatus.NotFound, "Membership not found");
  }

  const task = await Task.create({
    title,
    desc,
    assignedBy: req.user._id,
    assignedTo: assignedTo._id,
    project: projectId,
  });

  if (!task) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "task not created"
    );
  }

  if (!req.files) {
    res.status(400);
  }

  const attachments = await Promise.all(
    (req.files as Express.Multer.File[]).map(async (file) => {
      console.log("in attachment");
      const result = await uploadOnCloudinary(file.path);
      return {
        url: result?.secure,
        mimetype: file.mimetype,
        size: file.size,
      };
    })
  );

  console.log("attachments", attachments);

  task.attachments = attachments as IAttachments[];

  await task.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        { task: task, attachment: attachments },
        "task created"
      )
    );
});

const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, email, desc, status } = handleZodError(
    validateUpdateTask(req.body)
  );

  const { projectId, taskId } = req.params;

  const existingTask = await Task.findOne({ _id: taskId });
  if (!existingTask) {
    throw new CustomError(
      ResponseStatus.NotFound,
      "existing task does not exists"
    );
  }

  const assignedTo = await User.findOne({ email });
  if (!assignedTo) {
    throw new CustomError(ResponseStatus.NotFound, "user email not found");
  }

  const assignedUserMembership = await ProjectMember.findOne({
    user: assignedTo,
    project: projectId,
  });
  if (!assignedUserMembership) {
    throw new CustomError(ResponseStatus.NotFound, "Membership not found");
  }

  const updatePayload: Partial<{
    title: string;
    desc: string;
    assignedTo: string;
    status: string;
  }> = {};

  if (title !== undefined) updatePayload.title = title;
  if (desc !== "") updatePayload.desc = desc;
  // unknown error kese chala gya as string krne se
  if (email !== undefined) updatePayload.assignedTo = assignedTo._id as string;
  if (status !== undefined) updatePayload.status = status;

  if (Object.keys(updatePayload).length === 0) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "No update required"
    );
  }

  console.log(" update Payload", updatePayload);

  const taskUpdation = await Task.findByIdAndUpdate(taskId, updatePayload, {
    new: true,
  });
  if (!taskUpdation) {
    throw new CustomError(ResponseStatus.BadRequest, "task updation failed");
  }

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, null, "task created"));
});

const createSubTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId, projectId } = req.params;
  const { title } = handleZodError(validateSubTaskData(req.body));

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new CustomError(500, "invalid task id");
  }

  const subTask = await SubTask.findOne({ title });
  if (subTask) {
    throw new CustomError(ResponseStatus.Conflict, "Subtask already exists");
  }

  const newSubTask = await SubTask.create({
    title,
    task: taskId,
    project: projectId,
    createdBy: req.user._id,
  });

  if (!newSubTask) throw new CustomError(500, "subTask not created");

  res
    .status(200)
    .json(
      new ApiResponse(ResponseStatus.Success, newSubTask, "Subtask Created")
    );
});

const updateSubTask = asyncHandler(async (req: Request, res: Response) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = handleZodError(validateSubTaskData(req.body));

  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new CustomError(400, "invalid subtask id ");
  }

  const existingSubtask = await SubTask.findById(subTaskId);

  if (!existingSubtask) {
    throw new CustomError(400, "SubTask not exists");
  }

  const updatePayload: Partial<{ title: string; isCompleted: boolean }> = {};
  if (title !== undefined) updatePayload.title = title;
  if (isCompleted !== undefined) updatePayload.isCompleted = isCompleted;

  if (Object.keys(updatePayload).length === 0) {
    throw new CustomError(
      ResponseStatus.BadRequest,
      "At least one field is required to update"
    );
  }
  const updatedSubTask = await SubTask.findByIdAndUpdate(
    subTaskId,
    updatePayload,
    { new: true }
  );

  if (!updatedSubTask) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "update sub task failed"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        updatedSubTask,
        "SubTask updated successfully"
      )
    );
});

const deleteSubTask = asyncHandler(async (req: Request, res: Response) => {
  const { subTaskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new CustomError(
      ResponseStatus.BadRequest,
      "SubTask id doesnot exists"
    );
  }

  const deletedTask = await SubTask.findByIdAndDelete(subTaskId);
  if (!deleteTask)
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "Delete subtask failed"
    );

  res
    .status(200)
    .json(
      new ApiResponse(ResponseStatus.Success, deletedTask, "subtask deleted")
    );
});

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
      .json(new ApiResponse(ResponseStatus.Success, null, "Task deleted "));
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

const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new CustomError(ResponseStatus.BadRequest, "taskId does not exists");
  }

  const task = await Task.aggregate([
    {
      $match: {
          _id: new mongoose.Types.ObjectId(taskId) 
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "assignedByInfo",
      },
    },
    { $unwind: "$assignedByInfo" },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedToInfo",
      },
    },
    { $unwind: "$assignedToInfo" },
    {
      $project: {
        title: 1,
        desc: 1,
        status: 1,
        attachments: 1,
        updatedAt: 1,
        assignedTo: {
          userName: "$assignedToInfo.userName",
          avatar: "$assignedToInfo.avatar.url",
        },
        assignedBy: {
          userName: "$assignedByInfo.userName",
          avatar: "$assignedByInfo.avatar.url",
        },
      },
    },
  ]);

  if (!task) {
    throw new CustomError(500, "task retrieval failed");
  }

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, task, "task returned"));
});

const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new CustomError(ResponseStatus.BadRequest, "invalid projectId");
  }

  const allTasks = await Task.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId as string),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "assignedByInfo",
      },
    },
    { $unwind: "$assignedByInfo" },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedToInfo",
      },
    },
    { $unwind: "$assignedToInfo" },
    {
      $project: {
        title: 1,
        desc: 1,
        status: 1,
        attachments: 1,
        updatedAt: 1,
        assignedTo: {
          userName: "$assignedToInfo.userName",
          avatar: "$assignedToInfo.avatar.url",
        },
        assignedBy: {
          userName: "$assignedByInfo.userName",
          avatar: "$assignedByInfo.avatar.url",
        },
      },
    },
  ]);

  console.log(allTasks)

  res
    .status(200)
    .json(
      new ApiResponse(ResponseStatus.Success, allTasks, "all tasks returned")
    );
});

const addAttachments = asyncHandler(async (req: Request, res:Response) =>{
  const { taskId} = req.params
  const attachments = req.files as Express.Multer.File[]

  if( !mongoose.Types.ObjectId.isValid(taskId)){
    throw new CustomError(400, "task id is invalid")
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new CustomError(400, "Task not found");
  }

  if (!attachments || attachments.length === 0) {
    throw new CustomError(400,"attachments missing");
  }

  const existingAttachments = task.attachments?.length || 0;
  const newAttachments = attachments.length 

  if ((existingAttachments + newAttachments) > 5) {
    throw new CustomError(
      400,
      "Attachment limit exceeded.",
    );
  }
  const addAttachments = await Promise.all(
    attachments.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      if(!result){
        throw new CustomError(ResponseStatus.InternalServerError, "upload on cloudinary failed")
      }
      return {
        url: result.secure_url,
        mimetype: file.mimetype,
        size: file.size,
      };
    }),
  );

  task.attachments.push(...(addAttachments as IAttachments[]));

  await task.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, task.attachments, "Attachments added successfully"),
    );

})

const deleteAttachments = asyncHandler(async (req, res) => {
  const { attachmentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
    throw new CustomError(400,"Invalid attachment ID");
  }
  const result = await Task.updateOne(
    { "attachments._id": attachmentId },
    { $pull: { attachments: { _id: attachmentId } } },
  );
  if (result.modifiedCount === 0) {
    throw new  CustomError(400,"Invalid attachment ID");
  }
  res
    .status(200)
    .json(new ApiResponse(200, null, "Attachment Deleted Successfully"));
});

export {
  createTask,
  deleteTask,
  updateTask,
  getTasks,
  getTaskById,
  createSubTask,
  deleteSubTask,
  updateSubTask,
  addAttachments,
  deleteAttachments
};
