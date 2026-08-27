import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  createGoalSchema,
  updateGoalSchema,
  addMilestoneSchema,
  toggleMilestoneSchema,
  listGoalQuerySchema,
} from "@/lib/schemas/goal";

export const goalRouter = router({
  list: protectedProcedure
    .input(listGoalQuerySchema)
    .query(async ({ ctx, input }) => {
      const { cursor, limit, status } = input;
      const goals = await db.goal.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(status ? { status } : {}),
        },
        include: { milestones: { orderBy: { order: "asc" } }, _count: { select: { tasks: true } } },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      let nextCursor: string | undefined;
      if (goals.length > limit) nextCursor = goals.pop()?.id;
      return { goals, nextCursor };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const goal = await db.goal.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          milestones: { orderBy: { order: "asc" } },
          tasks: { include: { subtasks: true } },
        },
      });
      if (!goal) throw new TRPCError({ code: "NOT_FOUND" });
      return goal;
    }),

  create: protectedProcedure
    .input(createGoalSchema)
    .mutation(async ({ ctx, input }) => {
      const { milestones, ...data } = input;
      return db.goal.create({
        data: {
          ...data,
          userId: ctx.session.user.id,
          milestones: milestones?.length
            ? { create: milestones.map((title, order) => ({ title, order })) }
            : undefined,
        },
        include: { milestones: true },
      });
    }),

  update: protectedProcedure
    .input(updateGoalSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return db.goal.update({
        where: { id },
        data: { ...data, userId: ctx.session.user.id },
      });
    }),

  addMilestone: protectedProcedure
    .input(addMilestoneSchema)
    .mutation(async ({ input }) => {
      const count = await db.milestone.count({ where: { goalId: input.goalId } });
      return db.milestone.create({
        data: { goalId: input.goalId, title: input.title, order: count },
      });
    }),

  toggleMilestone: protectedProcedure
    .input(toggleMilestoneSchema)
    .mutation(async ({ input }) => {
      return db.milestone.update({
        where: { id: input.id },
        data: { isCompleted: input.isCompleted },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const goal = await db.goal.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!goal) throw new TRPCError({ code: "NOT_FOUND" });
      await db.goal.delete({ where: { id: input.id } });
      return { deleted: true };
    }),
});
