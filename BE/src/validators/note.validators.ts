import z from 'zod'

const CreateNoteSchema = z.object({
    title: z.string().trim().nonempty("Project title is required"),
    content : z.string().trim().nonempty("Project content is required")
})

const UpdateNoteSchema = z.object({
    title: z.string().trim().nonempty("Project title is required"),
    content : z.string().trim().nonempty("Project content is required") 
})

type CreateNote = z.infer<typeof CreateNoteSchema>
type UpdateNote = z.infer<typeof UpdateNoteSchema>

const validateCreateNoteData = (data: CreateNote)=>{
    return CreateNoteSchema.safeParse(data)
}
const validateUpdateNote = (data: UpdateNote)=>{
    return UpdateNoteSchema.safeParse(data)
}
export { validateCreateNoteData, validateUpdateNote }