"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/schemas/auth";
import { trpc } from "@/trpc/react";
import { PasswordStrength } from "./password-strength";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [done, setDone] = useState(false);
  const mutation = trpc.auth.resetPassword.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput & { confirm: string }>({
    resolver: zodResolver(resetPasswordSchema) as never,
    mode: "onBlur",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password") ?? "";

  const onSubmit = handleSubmit(async (values) => {
    if (values.password !== values.confirm) {
      setError("confirm", { message: "Parollar mos kelmadi" });
      return;
    }
    try {
      await mutation.mutateAsync({ token, password: values.password });
      setDone(true);
    } catch (err) {
      setError("password", {
        message: err instanceof Error ? err.message : "Xatolik yuz berdi",
      });
    }
  });

  if (!token) {
    return (
      <div className="py-4 text-center body-sm text-text-secondary">
        Havola noto'g'ri yoki muddati tugagan.{" "}
        <Link href="/forgot-password" className="text-primary hover:underline">
          Qaytadan so'rang
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="h4">Parol yangilandi</h2>
        <p className="body-sm text-text-secondary">
          Endi yangi parolingiz bilan kirishingiz mumkin.
        </p>
        <Button asChild className="mt-2">
          <Link href="/login">Kirish</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Yangi parol</Label>
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm">Parolni tasdiqlang</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={!!errors.confirm}
          {...register("confirm")}
        />
        {errors.confirm && (
          <p className="text-xs text-error">{errors.confirm.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Parolni yangilash
      </Button>
    </form>
  );
}
