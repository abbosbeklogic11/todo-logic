import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  createTaskSchema,
  updateTaskSchema,
  toggleTaskSchema,
  reorderTaskSchema,
  listTaskQuerySchema,
} from "@/lib/schemas/task";
import { recalculateGoalProgress } from "@/server/goal-progress";

const subtaskRouter = router({
  create: protectedProcedure
    .input(z.object({ taskId: z.string(), title: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      const count = await db.subtask.count({
        where: { taskId: input.taskId, task: { userId: ctx.session.user.id } },
      });
      return db.subtask.create({
        data: { taskId: input.taskId, title: input.title, position: count },
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const sub = await db.subtask.findFirst({
        where: { id: input.id, task: { userId: ctx.session.user.id } },
      });
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      return db.subtask.update({
        where: { id: input.id },
        data: { isCompleted: input.done },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      const sub = await db.subtask.findFirst({
        where: { id: input.id, task: { userId: ctx.session.user.id } },
      });
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      return db.subtask.update({
        where: { id: input.id },
        data: { title: input.title },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sub = await db.subtask.findFirst({
        where: { id: input.id, task: { userId: ctx.session.user.id } },
      });
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      await db.subtask.delete({ where: { id: input.id } });
      return { deleted: true };
    }),

  reorder: protectedProcedure
    .input(z.object({ taskId: z.string(), ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.ids.map((id, index) =>
          db.subtask.updateMany({
            where: { id, task: { userId: ctx.session.user.id } },
            data: { position: index },
          }),
        ),
      );
      return { ok: true };
    }),
});

export const taskRouter = router({
  subtasks: subtaskRouter,

  list: protectedProcedure
    .input(listTaskQuerySchema)
    .query(async ({ ctx, input }) => {
      const { cursor, limit, status, priority, goalId } = input;
      const tasks = await db.task.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(status ? { status } : {}),
          ...(priority ? { priority } : {}),
          ...(goalId ? { goalId } : {}),
        },
        include: { subtasks: true, category: true, tags: { include: { tag: true } } },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      let nextCursor: string | undefined;
      if (tasks.length > limit) nextCursor = tasks.pop()?.id;
      return { tasks, nextCursor };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await db.task.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: { subtasks: true, category: true, tags: { include: { tag: true } } },
      });
      if (!task) throw new TRPCError({ code: "NOT_FOUND" });
      return task;
    }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { subtasks, tagNames, ...data } = input;
      const count = await db.task.count({ where: { userId: ctx.session.user.id } });
      return db.task.create({
        data: {
          ...data,
          userId: ctx.session.user.id,
          position: count,
          subtasks: subtasks?.length
            ? { create: subtasks.map((s, i) => ({ title: s.title, position: i })) }
            : undefined,
          tags: tagNames?.length
            ? {
                create: await Promise.all(
                  tagNames.map(async (name) => {
                    const tag = await db.tag.upsert({
                      where: { userId_name: { userId: ctx.session.user.id, name } },
                      create: { userId: ctx.session.user.id, name },
                      update: {},
                    });
                    return { tagId: tag.id };
                  }),
                ),
              }
            : undefined,
        },
        include: { subtasks: true, tags: { include: { tag: true } } },
      });
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return db.task.update({
        where: { id },
        data: { ...data, userId: ctx.session.user.id },
      });
    }),

  toggleComplete: protectedProcedure
    .input(toggleTaskSchema)
    .mutation(async ({ input }) => {
      const task = await db.task.update({
        where: { id: input.id },
        data: {
          status: input.completed ? "COMPLETED" : "TODO",
          completedAt: input.completed ? new Date() : null,
        },
      });
      if (task.goalId) await recalculateGoalProgress(task.goalId);
      return task;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await db.task.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!task) throw new TRPCError({ code: "NOT_FOUND" });
      await db.task.delete({ where: { id: input.id } });
      if (task.goalId) await recalculateGoalProgress(task.goalId);
      return { deleted: true };
    }),

  reorder: protectedProcedure
    .input(reorderTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.ids.map((id, index) =>
          db.task.updateMany({
            where: { id, userId: ctx.session.user.id },
            data: { position: index },
          }),
        ),
      );
      return { ok: true };
    }),
});
