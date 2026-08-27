import { db } from "./db";

/**
 * Goal progressni backend ichida qayta hisoblaydi (spec §4).
 * Faqat backenddan chaqiriladi — client Goal.progress ni o'zi yozmaydi.
 */
export async function recalculateGoalProgress(goalId: string): Promise<number> {
  const tasks = await db.task.findMany({
    where: { goalId },
    select: { status: true },
  });
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  await db.goal.update({
    where: { id: goalId },
    data: {
      progress,
      completedAt: progress >= 100 ? new Date() : null,
    },
  });
  return progress;
}
