import mongoose, { Schema } from "mongoose";
import { TaskStatusType, AvailableTaskStatuses } from "../utils/constants";

interface ITask {
  title: string;
  desc: string;
  project: Schema.Types.ObjectId;
  assignedTo: Schema.Types.ObjectId;
  assignedBy: Schema.Types.ObjectId;
  status: TaskStatusType;
  attachments: string[];
}

const TaskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    desc: String,
    project: Schema.Types.ObjectId,
    assignedTo: Schema.Types.ObjectId,
    assignedBy: Schema.Types.ObjectId,
    status: AvailableTaskStatuses,
    attachments: [],
  },
});

const Task = mongoose.model('Task', TaskSchema)
export {Task}