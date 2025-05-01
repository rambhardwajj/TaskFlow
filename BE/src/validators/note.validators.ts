import z from 'zod'

const CreateNoteSchema = z.object({
    title: z.string().trim().nonempty("Project title is required"),
    content : z.string().trim().nonempty("Project content is required")
})

const UpdateNoteSchema = CreateNoteSchema.partial()

type CreateNote = z.infer<typeof CreateNoteSchema>

const validateCreateNoteData = (data: CreateNote)=>{
    return CreateNoteSchema.safeParse(data)
}
const validateUpdateNote = (data: Partial<CreateNote>)=>{
    return UpdateNoteSchema.safeParse(data)
}
export { validateCreateNoteData, validateUpdateNote }