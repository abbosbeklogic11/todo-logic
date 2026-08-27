import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Asosiy kontentga o'tish
      </a>
      <AppNav />
      <div
        id="main"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </div>
    </div>
  );
}
