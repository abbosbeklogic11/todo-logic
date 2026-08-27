import { z } from "zod";
import { taskPrioritySchema } from "./task";

export const updateSettingsSchema = z.object({
  weekStart: z.number().int().min(0).max(6).optional(),
  defaultTaskPriority: taskPrioritySchema.optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  productivityGoal: z.number().int().positive().optional(),
  theme: z.enum(["system", "light", "dark"]).optional(),
});
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
