import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  desc: string;
  createdBy: Schema.Types.ObjectId;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', ProjectSchema );
export {Project}