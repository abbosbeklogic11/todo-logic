import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { GoalCenter } from "@/components/goals/goal-center";

export default async function GoalsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <GoalCenter />
    </main>
  );
}
