import mongoose from "mongoose"
import { Schema } from "mongoose"
import { UserRoles, UserRoleType } from "../utils/permissions"

export interface IProjectMember extends Document {
    user : Schema.Types.ObjectId,
    project: Schema.Types.ObjectId,
    role:  UserRoleType
}

const ProjectMemberSchmea = new mongoose.Schema<IProjectMember> (
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
        project:{
            type: Schema.Types.ObjectId, 
            ref: "Project",
            required: true
        },
        role:{
            type: String,
            enum: Object.keys(UserRoles),
            required: true
        }
    },
    {
      timestamps: true,
    }
)

const ProjectMember = mongoose.model("ProjectMember", ProjectMemberSchmea)
export {ProjectMember}