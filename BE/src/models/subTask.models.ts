import mongoose, { Schema } from "mongoose";

interface IsubTask{
    title: string, 
    task: Schema.Types.ObjectId
    createdBy: Schema.Types.ObjectId,
    isCompleted: boolean 
}

const subTaskSchema = new mongoose.Schema<IsubTask>(
    {
        title: {
            type: String,
        },
        task:{
            type: Schema.Types.ObjectId,
            ref: "Task"
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

const SubTask =  mongoose.model('SubTask', subTaskSchema)
export {SubTask}