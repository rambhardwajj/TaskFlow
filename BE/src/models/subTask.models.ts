import mongoose, { Schema } from "mongoose";

interface IsubTask{
    title: string, 
    task: Schema.Types.ObjectId
    project: Schema.Types.ObjectId
    createdBy: Schema.Types.ObjectId,
    isCompleted: boolean 
}

const subTaskSchema = new mongoose.Schema<IsubTask>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        task:{
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        project:{
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        isCompleted: {
            type: Boolean
        }
    },
    {
      timestamps: true,
    }
)

// for preventing same title subTask in same task.
subTaskSchema.index({title: 1, task: 1, project: 1}, {unique: true})

const SubTask =  mongoose.model('SubTask', subTaskSchema)
export {SubTask}