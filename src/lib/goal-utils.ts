import type { BadgeVariant } from "@/lib/task-utils";

export const GOAL_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Faol",
  PAUSED: "To'xtatilgan",
  COMPLETED: "Bajarilgan",
  ARCHIVED: "Arxivlangan",
};

export function goalStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PAUSED":
      return "warning";
    case "COMPLETED":
      return "info";
    default:
      return "secondary";
  }
}

export function formatTargetDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short", year: "numeric" });
}

export function isGoalOverdue(
  value: string | Date | null | undefined,
  status: string,
): boolean {
  if (!value || status === "COMPLETED" || status === "ARCHIVED") return false;
  const d = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}
