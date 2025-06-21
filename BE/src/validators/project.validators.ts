import z from "zod"

const RoleEnum = z.enum(["owner", "projectAdmin", "member"]);

const CreateProjectSchema = z.object({
    name: z.string()
    .min(3, { message: "Project Name must be at least 3 characters long" })
    .max(15, { message: "Project Name must be at most 15 characters long" }),

    desc : z.string()
    .min(3, {message:"Project Description must be at least 3 characters long"})
    .max(100, { message: "Project Desc must be atleast 100"})
})

const UpdateProjectSchema = z.object({
    name: z.string()
    .min(3, { message: "Project Name must be at least 3 characters long" })
    .max(20, { message: "Project Name must be at most 20 characters long" }),

    desc : z.string()
    .max(100, { message: "Project Desc must be atleast 100"})
})
const MemberSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    role: z.enum(["projectAdmin", "member"])
})

type CreateProject = z.infer<typeof CreateProjectSchema>
type UpdateProject = z.infer<typeof UpdateProjectSchema>
type AddMember     = z.infer<typeof MemberSchema> 

const validateCreateProjectData = (data: CreateProject ) =>{
    return CreateProjectSchema.safeParse(data)
}
const validateUpdateProjectData = (data: UpdateProject ) => {
    return UpdateProjectSchema.safeParse(data);
}
const validateMemberData = (data: AddMember )=>{
    return MemberSchema.safeParse(data)
}

export {validateCreateProjectData, validateUpdateProjectData ,validateMemberData}