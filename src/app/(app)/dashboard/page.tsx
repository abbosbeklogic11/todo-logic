import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const name = session.user.name ?? session.user.email ?? "Foydalanuvchi";
  return <Dashboard name={name} />;
}
