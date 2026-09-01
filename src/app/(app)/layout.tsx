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
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Asosiy kontentga o'tish
      </a>
      <AppNav />
      <div className="lg:pl-[312px]">
        <div
          id="main"
          className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 md:py-8 md:pb-8 lg:px-8"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
