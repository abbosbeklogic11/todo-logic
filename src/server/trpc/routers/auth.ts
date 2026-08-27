import { randomBytes } from "crypto";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { hashPassword } from "@/lib/password";
import {
  registerSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas/auth";

function sendResetEmail(email: string, url: string) {
  if (process.env.RESEND_API_KEY) {
    void fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Todo Logic <onboarding@todologic.app>",
        to: email,
        subject: "Parolni tiklash",
        text: `Parolni tiklash uchun: ${url}`,
      }),
    });
  } else {
    console.warn(`[auth] Password reset link for ${email}: ${url}`);
  }
}

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const existing = await db.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bu email allaqachon ro'yxatdan o'tgan",
        });
      }
      const password = await hashPassword(input.password);
      const user = await db.user.create({
        data: { email: input.email, fullName: input.fullName, password },
      });
      await db.userSettings.create({ data: { userId: user.id } });

      const token = randomBytes(32).toString("hex");
      await db.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
      sendResetEmail(user.email, verifyUrl);
      return { id: user.id };
    }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input }) => {
      const record = await db.verificationToken.findUnique({
        where: { token: input.token },
      });
      if (!record || record.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token yaroqsiz yoki muddati tugagan",
        });
      }
      await db.user.update({
        where: { email: record.identifier },
        data: { emailVerified: new Date() },
      });
      await db.verificationToken.delete({ where: { token: input.token } });
      return { verified: true };
    }),

  requestPasswordReset: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { email: input.email },
      });
      // Xavfsizlik: foydalanuvchi mavjud bo'lmasa ham xato qaytarmaymiz
      if (user?.password) {
        const token = randomBytes(32).toString("hex");
        await db.verificationToken.create({
          data: {
            identifier: user.email,
            token,
            expires: new Date(Date.now() + 60 * 60 * 1000),
          },
        });
        const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
        sendResetEmail(user.email, url);
      }
      return { requested: true };
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const record = await db.verificationToken.findUnique({
        where: { token: input.token },
      });
      if (!record || record.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token yaroqsiz yoki muddati tugagan",
        });
      }
      const password = await hashPassword(input.password);
      await db.user.update({
        where: { email: record.identifier },
        data: { password },
      });
      await db.verificationToken.delete({ where: { token: input.token } });
      return { reset: true };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { settings: true },
    });
    return user;
  }),
});
