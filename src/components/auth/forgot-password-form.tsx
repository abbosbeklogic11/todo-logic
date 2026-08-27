"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas/auth";
import { trpc } from "@/trpc/react";

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false);
  const mutation = trpc.auth.requestPasswordReset.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    setDone(true);
  });

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
          <MailCheck className="size-7" />
        </span>
        <h2 className="h4">Havola yuborildi</h2>
        <p className="body-sm text-text-secondary">
          Agar bu email ro'yxatdan o'tgan bo'lsa, parolni tiklash havolasi
          yuborildi. Spam papkasini ham tekshiring.
        </p>
        <Button asChild variant="secondary" className="mt-2">
          <Link href="/login">Kirish sahifasiga qaytish</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
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
      <Button type="submit" loading={isSubmitting} className="w-full">
        Havola yuborish
      </Button>
      <p className="text-center body-sm text-text-secondary">
        <Link href="/login" className="text-primary hover:underline">
          Orqaga — kirish
        </Link>
      </p>
    </form>
  );
}
