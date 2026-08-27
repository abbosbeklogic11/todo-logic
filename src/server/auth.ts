import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { db } from "@/server/db";
import { verifyPassword } from "@/lib/password";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/login",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.password) return null;
        const ok = await verifyPassword(parsed.data.password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatar ?? undefined,
        };
      },
    }),
    Resend({
      from: process.env.EMAIL_FROM ?? "Todo Logic <onboarding@todologic.app>",
      // Email yuborish: RESEND_API_KEY mavjud bo'lsa Resend orqali yuborish
      // kerak (production). Kalit bo'lmasa dev rejimda havolani konsolga
      // chiqaradi. Resend ulanishi uchun shu joyga resend.emails.send qo'shiladi.
      sendVerificationRequest: async ({ identifier, url }) => {
        if (!process.env.RESEND_API_KEY) {
          console.warn(`[auth] Verification link for ${identifier}: ${url}`);
          return;
        }
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM ?? "Todo Logic <onboarding@todologic.app>",
            to: identifier,
            subject: "Todo Logic — kirish havolasi",
            text: `Kirish uchun quyidagi havoladan foydalaning: ${url}`,
          }),
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
});
