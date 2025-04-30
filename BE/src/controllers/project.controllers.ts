import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  validateUpdateProjectData,
  validateCreateProjectData,
  validateMemberData,
} from "../validators/project.validators";
import { handleZodError } from "../utils/handleZodErrors";
import { Project } from "../models/project.models";
import { ApiResponse } from "../utils/ApiResponse";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { ProjectMember } from "../models/projectMember.models";
import mongoose from "mongoose";
import { User } from "../models/user.models";
import { extractUserField } from "../utils/helper";

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

  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId as string),
      },
    },
    // returns all the projectMembership related to the user
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "ProjectPopulatedData",
      },
    },
    // returns all the data with populated project fields
    { $unwind: "$ProjectPopulatedData" },
    // will flatten array
    // i.e. if there are multiple values of array, this will create a seperate Object for each array element.
    {
      $lookup: {
        from: "users",
        localField: "ProjectPopulatedData.createdBy",
        foreignField: "_id",
        as: "createdByUser",
      },
    },
    // will populate the createdBy field of the projectPopulatedData object
    { $unwind: "$createdByUser" },
    {
      $lookup: {
        from: "projectmembers",
        localField: "project",
        foreignField: "project",
        as: "currProjectMemberships",
      },
    },
    // will populate the project feild with the project data
    // all the membership that the project has in projectMembership table will be populated
    {
      $project: {
        _id: 0,
        projectId: "$projectData._id",
        name: "$projectData.name",
        description: "$projectData.description",
        createdAt: "$projectData.createdAt",
        createdBy: {
          username: "$createdByUser.userName",
          email: "$createdByUser.email",
        },
        role: 1,
        memberCount: { $size: "$currProjectMemberships" },
      },
      // dry run the above properly
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, projects, "fsd"));

  // { { id, proj }, { id, proj:  }, }
  // .populate will populate the object of project in the membership object
  // const allProjectMemberships = await ProjectMember.find({
  //   user: userId,
  // }).populate("project");

  // const projects = allProjectMemberships.map(
  //   (membership) => membership.project
  // );

  // if (!projects || projects.length == 0) {
  //   throw new CustomError(ResponseStatus.NotFound, "Projects not found");
  // }

  // res
  //   .status(200)
  //   .json(
  //     new ApiResponse(ResponseStatus.Success, projects, "Projects populated")
  //   );
});

const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userId = req.user._id;
  // projectName, projectDesc, updatedAt, createdBy, members count
  const project = await ProjectMember.aggregate([
    {
      $match: {
        $and: [
          { user: new mongoose.Types.ObjectId(userId as string) },
          { project: new mongoose.Types.ObjectId(projectId as string) },
        ],
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projectData",
      },
    },
    { $unwind: "$projectData" },
    {
      $lookup: {
        from: "users",
        localField: "projectData.createdBy",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },
    {
      $lookup: {
        from: "projectmembers",
        localField: "project",
        foreignField: "project",
        as: "members",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members.user",
        foreignField: "_id",
        as: "memberUsers",
      },
    },
    {
      $project: {
        projectName: "$projectData.name",
        projectDesc: "$projectData.desc",
        projectOwner: "$projectData.createdBy",
        projectModified: "$projectData.updatedAt",

        userName: "$userData.userName",

        totalMembers: { $size: "$members" },

        members: {
          $map: {
            input: "$members",
            as: "member",
            in: {
              role: "$$member.role",
              userName: extractUserField("userName"),
              email: extractUserField("email"),
              avatar: extractUserField("avatar"),
            },
          },
        },
      },
    },
  ]);
  console.log(project);

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

  const { name, desc } = handleZodError(validateUpdateProjectData(req.body));

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
  await ProjectMember.deleteMany({ project: projectId });

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
  const { email, role } = handleZodError(validateMemberData(req.body));
  const projectId = req.params.projectId;

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError(
      ResponseStatus.NotFound,
      "Cannot add user as user doesnt exists"
    );
  }
  const userAlreadyInProject = await ProjectMember.findOne({
    user: user._id,
    project: projectId,
  });

  if (userAlreadyInProject) {
    throw new CustomError(
      ResponseStatus.Forbidden,
      "User is already in this project"
    );
  }

  await ProjectMember.create({
    user: user._id,
    project: projectId,
    role: role,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        { user: user._id, project: projectId, role: role },
        "Added member successfully"
      )
    );
});

const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const { email, role } = handleZodError(validateMemberData(req.body));
  const projectId = req.params.projectId;

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError(
      ResponseStatus.NotFound,
      "Cannot add user as user doesnt exists"
    );
  }

  const userInProject = await ProjectMember.findOne({
    user: user._id,
    project: projectId,
  });

  if (!userInProject) {
    throw new CustomError(
      ResponseStatus.Forbidden,
      "User is not present in this project"
    );
  }

  await ProjectMember.deleteOne({
    user: user._id,
    project: projectId,
    role: role,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        { user: user._id, project: projectId, role: role },
        "Deleted member successfully"
      )
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
  // update member role
  const { email, role } = handleZodError(validateMemberData(req.body));

  const projectId = req.params.projectId;

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError(
      ResponseStatus.NotFound,
      "Cannot update user details as user doesnt exists"
    );
  }
  const userAlreadyInProject = await ProjectMember.findOne({
    user: user._id,
    project: projectId,
  });

  if (!userAlreadyInProject) {
    throw new CustomError(
      ResponseStatus.Forbidden,
      "User is not in this project"
    );
  }

  await ProjectMember.updateOne({
    user: user._id,
    project: projectId,
    role: role,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        {},
        "User role updation successfull"
      )
    );
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new CustomError(ResponseStatus.BadRequest, "Project does not exists");
  }

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId as string),
      },
    },
    {
      $lookup:{
        from : "users", 
        localField: "user",
        foreignField: "_id",
        as : "userInfo"
      }
    },
    { $unwind: "$userInfo" },
    {
      $lookup:{
        from : "projects", 
        localField: "project",
        foreignField: "_id",
        as : "projectInfo"
      }
    },
    { $unwind: "$projectInfo" },

    {
      $project: {
        role: "$role",
        userInfo: {
          userName: "$userInfo.userName", 
          email: "$userInfo.email",
          avatar: "$userInfo.avatar"
        },
        projectName: "$projectInfo.name",
      }
    }
  ]);

  res
    .status(ResponseStatus.Success)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        projectMembers,
        "project memebers fetched successfully"
      )
    );
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
  getProjectMembers,
};
