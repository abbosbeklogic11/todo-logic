import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Ro'yxatdan o'tish — Todo Logic" };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/onboarding");
  return (
    <AuthShell title="Hisob yarating" subtitle="Bepul boshlang">
      <RegisterForm />
    </AuthShell>
  );
}
