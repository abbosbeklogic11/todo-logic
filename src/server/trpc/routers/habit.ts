import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  createHabitSchema,
  toggleHabitSchema,
  deleteHabitSchema,
} from "@/lib/schemas/habit";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export const habitRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.habit.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        logs: {
          where: { date: { gte: startOfDay(new Date(Date.now() - 6 * 86400000)) } },
        },
      },
      orderBy: { id: "asc" },
    });
  }),

  create: protectedProcedure
    .input(createHabitSchema)
    .mutation(async ({ ctx, input }) => {
      return db.habit.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),

  toggleToday: protectedProcedure
    .input(toggleHabitSchema)
    .mutation(async ({ ctx, input }) => {
      const date = startOfDay(input.date ?? new Date());
      const habit = await db.habit.findFirst({
        where: { id: input.habitId, userId: ctx.session.user.id },
      });
      if (!habit) throw new TRPCError({ code: "NOT_FOUND" });

      const existing = await db.habitLog.findUnique({
        where: { habitId_date: { habitId: habit.id, date } },
      });

      if (existing) {
        await db.habitLog.delete({ where: { id: existing.id } });
        await db.habit.update({
          where: { id: habit.id },
          data: { streak: Math.max(0, habit.streak - 1) },
        });
        return { completed: false };
      }

      await db.habitLog.create({
        data: { habitId: habit.id, date, completed: true },
      });
      const newStreak = habit.streak + 1;
      await db.habit.update({
        where: { id: habit.id },
        data: {
          streak: newStreak,
          bestStreak: Math.max(habit.bestStreak, newStreak),
        },
      });
      return { completed: true, streak: newStreak };
    }),

  delete: protectedProcedure
    .input(deleteHabitSchema)
    .mutation(async ({ ctx, input }) => {
      const habit = await db.habit.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!habit) throw new TRPCError({ code: "NOT_FOUND" });
      await db.habit.delete({ where: { id: input.id } });
      return { deleted: true };
    }),
});
