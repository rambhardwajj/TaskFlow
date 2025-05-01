import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import { asyncHandler } from "../utils/asyncHandler";
import { ProjectNote } from "../models/projectNote.models";
import { ApiResponse } from "../utils/ApiResponse";
import { handleZodError } from "../utils/handleZodErrors";
import {
  validateCreateNoteData,
  validateUpdateNote,
} from "../validators/note.validators";
import mongoose from "mongoose";

const createNote = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, content } = handleZodError(validateCreateNoteData(req.body));

  const note = await ProjectNote.create({
    createdBy: req.user._id,
    title,
    project: projectId,
    content,
  });

  if (!note) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "Note not created"
    );
  }
  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, note, "Note created"));
});

const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new CustomError(ResponseStatus.BadRequest, "Invalid note ID");
  }

  const note = ProjectNote.findOne({ _id: noteId }).populate({
    path: "createdBy",
    select: "userName email avatar",
  });

  if (!note) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "Note doesnot exist"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, { note }, "Note returned"));
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const notes = await ProjectNote.aggregate([
    {
      $match: { project: new mongoose.Types.ObjectId(projectId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },

    {
      $project: {
        title: "$title",
        content: "$content",
        userName: "$userInfo.userName",
        email: "$userInfo.email",
        avatar: "$userInfo.avatar"
      },
    },
  ]);
  console.log(notes);

  if (!notes) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "notes not created"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, notes, "Notes returned"));
});

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new CustomError(ResponseStatus.BadRequest, "Invalid note ID");
  }
  await ProjectNote.findByIdAndDelete({ noteId });

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, {}, "Note deleted"));
});

const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new CustomError(ResponseStatus.BadRequest, "Invalid note ID");
  }

  const { title, content } = handleZodError(validateUpdateNote(req.body));

  const updatePayload: Partial<{ title: string; content: string }> = {};

  if (title !== undefined) updatePayload.title = title;
  if (content !== undefined) updatePayload.content = content;

  const updatedNote = await ProjectNote.findByIdAndUpdate(
    {noteId},
    updatePayload,
    {new: true}
  )

  res
    .status(200)
    .json(new ApiResponse(ResponseStatus.Success, updatedNote, "note updated"));
});

export { createNote, getNoteById, getAll, deleteNote, updateNote };
