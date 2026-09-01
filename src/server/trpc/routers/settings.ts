import { router, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { updateSettingsSchema } from "@/lib/schemas/settings";

export const settingsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const settings = await db.userSettings.upsert({
      where: { userId: ctx.session.user.id },
      create: { userId: ctx.session.user.id },
      update: {},
    });
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { theme: true, email: true, fullName: true },
    });
    return { ...settings, ...user };
  }),

  update: protectedProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const { theme, ...settingsData } = input;
      const settings = await db.userSettings.upsert({
        where: { userId: ctx.session.user.id },
        create: { userId: ctx.session.user.id, ...settingsData },
        update: settingsData,
      });
      if (theme) {
        await db.user.update({
          where: { id: ctx.session.user.id },
          data: { theme },
        });
      }
      return settings;
    }),
});
