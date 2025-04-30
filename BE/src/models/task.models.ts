import mongoose, { Schema } from "mongoose";
import { TaskStatusType, AvailableTaskStatuses, TaskStatus } from "../utils/constants";

export interface IAttachments{
  url:  String ,
  mimetype:  String ,
  size: Number ,
}

export interface ITask {
  title: string;
  desc: string;
  project: Schema.Types.ObjectId;
  assignedTo: Schema.Types.ObjectId;
  assignedBy: Schema.Types.ObjectId;
  status: TaskStatusType;
  attachments: IAttachments[];
}


const TaskSchema = new mongoose.Schema<ITask>({
  title:{
    type: String,
    required : true,
    unique: true, 
    trim: true
  },
  desc:{
    type: String,
    trim: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
      type: String,
      enum:  TaskStatus,
      default: TaskStatus.TODO
  },
  attachments: {
    type: [
      {
        url: { type: String },
        mimetype: { type: String },
        size: { type: Number },
      },
    ],
    default: [],
  },

},
{timestamps: true}
);

const Task = mongoose.model("Task", TaskSchema);
export { Task };
