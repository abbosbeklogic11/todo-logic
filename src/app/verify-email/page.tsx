import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmail } from "@/components/auth/verify-email";

export const metadata: Metadata = { title: "Emailni tasdiqlash — Todo Logic" };

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Email tasdiqlash">
      <Suspense fallback={<p className="text-center body-sm text-text-muted">Yuklanmoqda…</p>}>
        <VerifyEmail />
      </Suspense>
    </AuthShell>
  );
}
