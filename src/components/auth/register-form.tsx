"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { trpc } from "@/trpc/react";
import { PasswordStrength } from "./password-strength";
import { GoogleButton } from "./google-button";
import { Separator } from "@/components/ui/separator";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const registerMutation = trpc.auth.register.useMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const password = watch("password") ?? "";

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await registerMutation.mutateAsync(values);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (res?.error) {
        setServerError("Ro'yxatdan o'tdingiz, lekin kirishda xatolik yuz berdi");
        return;
      }
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Ro'yxatdan o'tib bo'lmadi",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
        >
          <AlertCircle className="size-4 shrink-0" />
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Ism familiya</Label>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="Alisher Navoiy"
          error={!!errors.fullName}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-error">{errors.fullName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="siz@example.com"
          error={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Parol</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register("password")}
        />
        <PasswordStrength password={password} />
        {errors.password && (
          <p className="text-xs text-error">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Ro'yxatdan o'tish
      </Button>

      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="caption">yoki</span>
        <Separator className="flex-1" />
      </div>

      <GoogleButton />

      <p className="text-center body-sm text-text-secondary">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Kiring
        </Link>
      </p>
    </form>
  );
}
