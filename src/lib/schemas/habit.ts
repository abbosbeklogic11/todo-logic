import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1).max(120),
  frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
});
export type CreateHabitInput = z.infer<typeof createHabitSchema>;

export const toggleHabitSchema = z.object({
  habitId: z.string(),
  date: z.coerce.date().optional(),
});

export const deleteHabitSchema = z.object({ id: z.string() });

export const updateHabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(120).optional(),
  frequency: z.enum(["daily", "weekly", "custom"]).optional(),
});
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
