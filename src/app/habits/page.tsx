import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { HabitCenter } from "@/components/habits/habit-center";

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <HabitCenter />
    </main>
  );
}
