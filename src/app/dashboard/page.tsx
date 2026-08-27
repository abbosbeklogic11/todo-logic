import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/server/auth";
import { CheckSquare } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const name = session.user.name ?? session.user.email ?? "Foydalanuvchi";

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border surface-glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <CheckSquare className="size-5" />
            </span>
            <span className="tracking-tight">Todo Logic</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <Dashboard name={name} />
    </div>
  );
}
