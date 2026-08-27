import { router, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "@/lib/schemas/category";

export const categoryRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.category.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
    });
  }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return db.category.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),

  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.category.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input }) => {
      return db.category.delete({ where: { id: input.id } });
    }),
});
