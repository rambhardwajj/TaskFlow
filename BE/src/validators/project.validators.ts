import z from "zod"

const CreateProjectSchema = z.object({
    name: z.string()
    .min(3, { message: "Project Name must be at least 3 characters long" })
    .max(20, { message: "Project Name must be at most 20 characters long" }),

    desc : z.string()
    .max(100, { message: "Project Desc must be atleast 100"}),

    createdBy:z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
})

type CreateProject = z.infer<typeof CreateProjectSchema>

const validateCreateProjectData = (data: CreateProject ) =>{
    return CreateProjectSchema.safeParse(data)
}

export {validateCreateProjectData}