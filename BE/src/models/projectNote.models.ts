import mongoose, { Schema } from "mongoose";

interface IProjectNote extends Document{
    createdBy: Schema.Types.ObjectId,
    project: Schema.Types.ObjectId,
    content : string
}

const ProjectNoteSchema = new mongoose.Schema<IProjectNote>(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, 
            unique: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true
        },
        content: {
            type: String, 
        }
    }
)

const ProjectNote = mongoose.model("ProjectNote", ProjectNoteSchema)
export {ProjectNote}