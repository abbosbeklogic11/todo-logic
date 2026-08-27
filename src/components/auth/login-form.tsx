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
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { GoogleButton } from "./google-button";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setServerError("Email yoki parol noto'g'ri");
      return;
    }
    router.push("/onboarding");
    router.refresh();
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="siz@example.com"
          error={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Parol</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Unutdingizmi?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-error">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Kirish
      </Button>

      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="caption">yoki</span>
        <Separator className="flex-1" />
      </div>

      <GoogleButton />

      <p className="text-center body-sm text-text-secondary">
        Hisobingiz yo'qmi?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </form>
  );
}
