import z from "zod";
import { TaskStatus } from "../utils/constants";

const TaskSchema = z.object({
  title: z.string().trim().nonempty("Task needs to have some title"),
  desc: z.string().trim().nonempty("Task needs to have some title"),
  email: z.string().email(),
});

const UpdateTaskSchema = TaskSchema.extend({
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
}).partial();


export type TaskData = z.infer<typeof TaskSchema>;
export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>;

export const validateTask = (data: TaskData) => {
  return TaskSchema.safeParse(data);
};
export const validateUpdateTask = (data: UpdateTaskData) => {
  return UpdateTaskSchema.safeParse(data);
};

// status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
