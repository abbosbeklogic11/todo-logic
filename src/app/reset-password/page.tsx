import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Yangi parol — Todo Logic" };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Yangi parol" subtitle="Parolingizni kiriting">
      <Suspense fallback={<p className="text-center body-sm text-text-muted">Yuklanmoqda…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
