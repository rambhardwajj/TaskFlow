import z from "zod"
import { TaskStatus,  } from "../utils/constants"

const TaskSchema = z.object({
    title: z.string().trim().nonempty("Task needs to have some title"),
    desc: z.string().trim().nonempty("Task needs to have some title"),
    email: z.string().email(),
    status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
})

export type TaskData = z.infer<typeof TaskSchema>

export const validateTask = (data : TaskData) =>{
    return TaskSchema.safeParse(data);
}