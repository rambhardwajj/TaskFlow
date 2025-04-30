import z from 'zod'

const CreateNoteSchema = z.object({
    title: z.string().trim().nonempty("Project title is required"),
    content : z.string().trim().nonempty("Project content is required")
})


type CreateNote = z.infer<typeof CreateNoteSchema>


const validateCreateNoteData = (data: CreateNote)=>{
    return CreateNoteSchema.safeParse(data)
}

export { validateCreateNoteData }