import { z } from "zod";

export const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskPrioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: taskPrioritySchema.default("MEDIUM"),
  dueAt: z.coerce.date().optional(),
  goalId: z.string().optional(),
  milestoneId: z.string().optional(),
  categoryId: z.string().optional(),
  tagNames: z.array(z.string().min(1)).optional(),
  subtasks: z
    .array(z.object({ title: z.string().min(1) }))
    .max(50)
    .optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema
  .omit({ subtasks: true, tagNames: true })
  .partial()
  .extend({ id: z.string(), status: taskStatusSchema.optional() });
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const toggleTaskSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
});

export const reorderTaskSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const listTaskQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(200).default(20),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  goalId: z.string().optional(),
});
