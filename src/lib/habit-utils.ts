import { isSameDay } from "@/lib/task-utils";

export const HABIT_FREQUENCY_LABELS: Record<string, string> = {
  daily: "Har kuni",
  weekly: "Haftada",
  custom: "Maxsus",
};

export type HabitLog = { date: string | Date; completed: boolean };

function startOfDayKey(d: Date): string {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c.toISOString().slice(0, 10);
}

export function lastNDates(n: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arr: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    arr.push(new Date(today.getTime() - i * 86400000));
  }
  return arr;
}

export function buildHeatmap(
  logs: HabitLog[],
  n = 7,
): { date: Date; done: boolean }[] {
  const map = new Map<string, boolean>();
  for (const l of logs) {
    const d = l.date instanceof Date ? l.date : new Date(l.date);
    map.set(startOfDayKey(d), !!l.completed);
  }
  return lastNDates(n).map((d) => ({ date: d, done: map.get(startOfDayKey(d)) ?? false }));
}

export function isDoneToday(logs: HabitLog[]): boolean {
  const today = new Date();
  return logs.some(
    (l) => l.completed && isSameDay(new Date(l.date), today),
  );
}

export function dayLabel(d: Date): string {
  return d.toLocaleDateString("uz-UZ", { weekday: "short" }).slice(0, 2);
}
