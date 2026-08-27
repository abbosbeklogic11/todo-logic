import { z } from "zod";
import { PASSWORD_POLICY } from "@/lib/password";

export const emailSchema = z.string().email("Noto'g'ri email manzili");

export const registerSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
  email: emailSchema,
  password: z
    .string()
    .min(
      PASSWORD_POLICY.minLength,
      `Parol kamida ${PASSWORD_POLICY.minLength} belgidan iborat bo'lishi kerak`,
    )
    .regex(
      PASSWORD_POLICY.pattern,
      "Parolda 1 ta katta harf, 1 ta raqam va 1 ta maxsus belgi bo'lishi shart",
    ),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Parol kiritilishi shart"),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: registerSchema.shape.password,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({ token: z.string().min(1) });
