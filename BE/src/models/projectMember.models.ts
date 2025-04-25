import mongoose from "mongoose"
import { Schema } from "mongoose"
import { UserRoles, UserRoleType } from "../utils/constants"

interface IProjectMember{
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
            enum: Object.values(UserRoles),
            required: true
        }
    }
)