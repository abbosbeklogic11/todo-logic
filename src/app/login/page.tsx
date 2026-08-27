import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Kirish — Todo Logic" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/onboarding");
  return (
    <AuthShell title="Xush kelibsiz" subtitle="Hisobingizga kiring">
      <LoginForm />
    </AuthShell>
  );
}
