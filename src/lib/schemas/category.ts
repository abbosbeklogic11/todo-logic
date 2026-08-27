import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Rang #RRGGBB formatida bo'lishi kerak"),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({ id: z.string() });

export const deleteCategorySchema = z.object({ id: z.string() });
