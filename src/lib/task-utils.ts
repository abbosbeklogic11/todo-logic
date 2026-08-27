import type { TaskStatus, TaskPriority } from "@/lib/schemas/task";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Qilinmagan",
  IN_PROGRESS: "Jarayonda",
  COMPLETED: "Bajarilgan",
  ARCHIVED: "Arxivlangan",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Past",
  MEDIUM: "O'rta",
  HIGH: "Yuqori",
  URGENT: "Shoshilinch",
};

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

export function priorityVariant(priority: TaskPriority): BadgeVariant {
  switch (priority) {
    case "LOW":
      return "secondary";
    case "MEDIUM":
      return "default";
    case "HIGH":
      return "warning";
    case "URGENT":
      return "error";
    default:
      return "default";
  }
}

export function statusVariant(status: TaskStatus): BadgeVariant {
  switch (status) {
    case "TODO":
      return "secondary";
    case "IN_PROGRESS":
      return "info";
    case "COMPLETED":
      return "success";
    case "ARCHIVED":
      return "default";
    default:
      return "default";
  }
}

export const BOARD_COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

export const WEEKDAYS_SHORT = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function coerceDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Returns a 6x7 matrix (weeks of Mondays-first days) covering the given month. */
export function monthMatrix(year: number, month: number): Date[][] {
  const first = startOfMonth(year, month);
  // Monday-first offset: JS getDay() 0=Sun..6=Sat -> convert to Mon=0
  const jsDay = first.getDay();
  const mondayIndex = (jsDay + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayIndex);

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

/** Human-friendly relative label for a due date (Uzbek). */
export function dueLabel(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      startToday.getTime()) /
      86400000,
  );
  if (diff < 0) return "Kechikkan";
  if (diff === 0) return "Bugun";
  if (diff === 1) return "Ertaga";
  return formatDueDate(d);
}

export function formatDueDate(value: string | Date | null | undefined): string {
  const d = coerceDate(value);
  if (!d) return "";
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}

export function isOverdue(value: string | Date | null | undefined): boolean {
  const d = coerceDate(value);
  if (!d) return false;
  const now = new Date();
  return d.getTime() < now.getTime() && !isToday(d);
}

/** Groups tasks that have a due date within the given month by day-of-month. */
export function groupTasksByDay<T extends { dueAt: string | Date | null }>(
  tasks: T[],
  year: number,
  month: number,
): Map<number, T[]> {
  const map = new Map<number, T[]>();
  for (const task of tasks) {
    const d = coerceDate(task.dueAt);
    if (!d) continue;
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const day = d.getDate();
    const list = map.get(day) ?? [];
    list.push(task);
    map.set(day, list);
  }
  return map;
}
