import { z } from "zod";

export const goalStatusSchema = z.enum([
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
]);
export type GoalStatus = z.infer<typeof goalStatusSchema>;

export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  targetDate: z.coerce.date().optional(),
  milestones: z.array(z.string().min(1)).max(30).optional(),
});
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = createGoalSchema
  .omit({ milestones: true })
  .partial()
  .extend({ id: z.string(), status: goalStatusSchema.optional() });
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const addMilestoneSchema = z.object({
  goalId: z.string(),
  title: z.string().min(1).max(200),
});

export const toggleMilestoneSchema = z.object({
  id: z.string(),
  isCompleted: z.boolean(),
});

export const listGoalQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(200).default(20),
  status: goalStatusSchema.optional(),
});
