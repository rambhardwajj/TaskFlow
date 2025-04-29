import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  validateAddMemberSchema,
  validateCreateProjectData,
  validateUpdateProjectSchemaData,
} from "../validators/project.validators";
import { handleZodError } from "../utils/handleZodErrors";
import { Project } from "../models/project.models";
import { ApiResponse } from "../utils/ApiResponse";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { ProjectMember } from "../models/projectMember.models";
import mongoose from "mongoose";

const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, desc } = handleZodError(validateCreateProjectData(req.body));
  const clientSession = await mongoose.startSession();
  clientSession.startTransaction();
  let project;
  let projectMember;
  try {
    project = await Project.create([{ name, desc, createdBy: req.user._id }], {
      session: clientSession,
    });
    // throw new CustomError(ResponseStatus.NotFound, "test")
    projectMember = await ProjectMember.create(
      [{ user: req.user._id, project: project[0]._id, role: "owner" }],
      { session: clientSession }
    );
    await clientSession.commitTransaction();
  } catch (error) {
    await clientSession.endSession();
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "Transaction Failed"
    );
  } finally {
    console.log("here");
    await clientSession.endSession();
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        { project, projectMember },
        "Project created successfully. User is the owner of the created Project"
      )
    );
});

// pagination yet to be implemented
const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  if (!userId) {
    throw new CustomError(ResponseStatus.NotFound, " User not found");
  }

  // { { id, proj }, { id, proj:  }, }
  // .populate will populate the object of project in the membership object
  const allProjectMemberships = await ProjectMember.find({
    user: userId,
  }).populate("project");

  const projects = allProjectMemberships.map(
    (membership) => membership.project
  );

  if (!projects || projects.length == 0) {
    throw new CustomError(ResponseStatus.NotFound, "Projects not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(ResponseStatus.Success, projects, "Projects populated")
    );
});

const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectMemberships = await ProjectMember.findOne({
    user: req.user._id,
    project: projectId,
  });

  if (!projectMemberships) {
    throw new CustomError(ResponseStatus.Unauthorized, "Access Denied");
  }
  const project = await Project.findOne({ _id: projectId });
  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, project, "Project sent"));
});

const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectMemberships = await ProjectMember.findOne({
    user: req.user._id,
    project: projectId,
  });

  const { name, desc } = handleZodError(
    validateUpdateProjectSchemaData(req.body)
  );

  if (!projectMemberships) {
    throw new CustomError(ResponseStatus.Unauthorized, "Access Denied");
  }
  const project = await Project.findOne({ _id: projectId });

  if (!project) {
    throw new CustomError(ResponseStatus.NotFound, "Project doesnot exists");
  }
  project.name = name;
  project.desc = desc;

  await project.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        {},
        "Project Updated successfully"
      )
    );
});

const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectMemberships = await ProjectMember.findOne({
    user: req.user._id,
    project: projectId,
  });

  if (!projectMemberships) {
    throw new CustomError(ResponseStatus.Unauthorized, "Access Denied");
  }
  const project = await Project.findOne({ _id: projectId });

  if (!project) {
    throw new CustomError(ResponseStatus.NotFound, "Project doesnot exists");
  }

  await Project.findOneAndDelete({ _id: projectId });

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        { project, projectMemberships },
        "Project created successfully. User is the owner of the created Project"
      )
    );
});

const addMember = asyncHandler(async (req: Request, res: Response) => {
  const { email, role } = handleZodError(validateAddMemberSchema(req.body));

  

});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
