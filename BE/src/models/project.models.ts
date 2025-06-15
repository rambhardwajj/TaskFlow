import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
import { Task } from "./task.models";

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
    },
  },
  {
    timestamps: true,
  }
);

// unique project name per user
ProjectSchema.index({ name: 1, createdBy: 1 }, { unique: true });

ProjectSchema.pre("findOneAndDelete", async function (next) {
  const projectToDelete = await this.model.findOne(this.getFilter());

  if (projectToDelete) {
    await Task.deleteMany({ project: projectToDelete._id });
  }

  next();
});

const Project = mongoose.model("Project", ProjectSchema);
export { Project };
