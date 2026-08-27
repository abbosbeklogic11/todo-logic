import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Parolni unutdingizmi? — Todo Logic" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Parolni tiklash"
      subtitle="Emailingizga havola yuboramiz"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
