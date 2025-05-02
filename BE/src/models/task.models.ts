import mongoose, { Schema } from "mongoose";
import { TaskStatusType, AvailableTaskStatuses, TaskStatus } from "../utils/constants";

export interface IAttachments extends Document{
  url:  string ,
  mimetype:  string ,
  size: number ,
}

export interface ITask extends Document {
  title: string;
  desc: string;
  project: Schema.Types.ObjectId;
  assignedTo: Schema.Types.ObjectId;
  assignedBy: Schema.Types.ObjectId;
  status?: TaskStatusType;
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

TaskSchema.index({title: 1, project: 1}, {unique: true})


const Task = mongoose.model("Task", TaskSchema);
export { Task };
