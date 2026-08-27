import { describe, it, expect } from "vitest";
import {
  monthMatrix,
  groupTasksByDay,
  priorityVariant,
  isOverdue,
  BOARD_COLUMNS,
  dueLabel,
} from "@/lib/task-utils";

describe("task-utils", () => {
  it("priorityVariant maps all priorities", () => {
    expect(priorityVariant("LOW")).toBe("secondary");
    expect(priorityVariant("MEDIUM")).toBe("default");
    expect(priorityVariant("HIGH")).toBe("warning");
    expect(priorityVariant("URGENT")).toBe("error");
  });

  it("monthMatrix returns 6 weeks of 7 days", () => {
    const weeks = monthMatrix(2026, 1); // Feb 2026
    expect(weeks).toHaveLength(6);
    expect(weeks[0]).toHaveLength(7);
  });

  it("groupTasksByDay groups by day-of-month within month", () => {
    const tasks = [
      { dueAt: new Date(2026, 1, 10).toISOString() },
      { dueAt: new Date(2026, 1, 10).toISOString() },
      { dueAt: new Date(2026, 1, 20).toISOString() },
      { dueAt: new Date(2026, 2, 5).toISOString() }, // different month
      { dueAt: null },
    ];
    const map = groupTasksByDay(tasks, 2026, 1);
    expect(map.get(10)).toHaveLength(2);
    expect(map.get(20)).toHaveLength(1);
    expect(map.get(5)).toBeUndefined();
    expect(map.has(1)).toBe(false);
  });

  it("isOverdue is false for future and null dates", () => {
    expect(isOverdue(null)).toBe(false);
    expect(isOverdue(new Date(Date.now() + 86400000).toISOString())).toBe(false);
    expect(isOverdue(new Date(Date.now() - 86400000).toISOString())).toBe(true);
  });

  it("BOARD_COLUMNS excludes ARCHIVED", () => {
    expect(BOARD_COLUMNS).toEqual(["TODO", "IN_PROGRESS", "COMPLETED"]);
  });

  it("dueLabel returns relative Uzbek labels", () => {
    const now = new Date();
    const startToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const today = new Date(startToday);
    const tomorrow = new Date(startToday.getTime() + 86400000);
    const yesterday = new Date(startToday.getTime() - 86400000);
    const nextWeek = new Date(startToday.getTime() + 7 * 86400000);
    expect(dueLabel(today)).toBe("Bugun");
    expect(dueLabel(tomorrow)).toBe("Ertaga");
    expect(dueLabel(yesterday)).toBe("Kechikkan");
    expect(dueLabel(nextWeek)).not.toBe("Bugun");
    expect(dueLabel(nextWeek)).not.toBe("Ertaga");
    expect(dueLabel(nextWeek)).not.toBe("Kechikkan");
    expect(dueLabel(null)).toBe("");
  });
});
