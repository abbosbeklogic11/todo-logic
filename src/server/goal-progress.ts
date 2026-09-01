import { db } from "./db";

/**
 * Goal progressni backend ichida qayta hisoblaydi (spec §4).
 * Faqat backenddan chaqiriladi — client Goal.progress ni o'zi yozmaydi.
 */
export async function recalculateGoalProgress(goalId: string): Promise<number> {
  const [milestones, tasks] = await Promise.all([
    db.milestone.findMany({ where: { goalId }, select: { isCompleted: true } }),
    db.task.findMany({
      where: { OR: [{ goalId }, { milestone: { goalId } }] },
      select: { status: true },
    }),
  ]);
  const total = milestones.length + tasks.length;
  const completed =
    milestones.filter((m) => m.isCompleted).length +
    tasks.filter((t) => t.status === "COMPLETED").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  await db.goal.update({
    where: { id: goalId },
    data: {
      progress,
      status: progress >= 100 ? "COMPLETED" : progress > 0 ? "ACTIVE" : undefined,
      completedAt: progress >= 100 ? new Date() : null,
    },
  });
  return progress;
}
