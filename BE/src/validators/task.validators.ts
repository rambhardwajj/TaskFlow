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

const subTaskSchema = z.object({
  title: z.string().trim().nonempty("Task needs to have some title"),
});

const updateSubTaskSchema = subTaskSchema.extend({
  isCompleted: z.boolean()
}).partial()

export type TaskData = z.infer<typeof TaskSchema>;
export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>;
export type SubTaskData = z.infer<typeof subTaskSchema>
export type UpdateSubTaskData = z.infer<typeof updateSubTaskSchema>

export const validateTask = (data: TaskData) => {
  return TaskSchema.safeParse(data);
};
export const validateUpdateTask = (data: UpdateTaskData) => {
  return UpdateTaskSchema.safeParse(data);
};
export const validateSubTaskData = (data: SubTaskData) =>
  subTaskSchema.safeParse(data);
export const validateUpdateSubTaskData= (data: UpdateSubTaskData ) => updateSubTaskSchema.safeParse(data);

// status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
