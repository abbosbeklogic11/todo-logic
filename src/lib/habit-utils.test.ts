import { describe, it, expect } from "vitest";
import {
  HABIT_FREQUENCY_LABELS,
  buildHeatmap,
  isDoneToday,
  lastNDates,
} from "@/lib/habit-utils";

describe("habit-utils", () => {
  it("frequency labels cover all kinds", () => {
    expect(HABIT_FREQUENCY_LABELS.daily).toBe("Har kuni");
    expect(HABIT_FREQUENCY_LABELS.weekly).toBe("Haftada");
    expect(HABIT_FREQUENCY_LABELS.custom).toBe("Maxsus");
  });

  it("lastNDates returns n consecutive days ending today", () => {
    const dates = lastNDates(7);
    expect(dates).toHaveLength(7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(dates[6]!.toDateString()).toBe(today.toDateString());
    const diff =
      (dates[6]!.getTime() - dates[0]!.getTime()) / 86400000;
    expect(diff).toBe(6);
  });

  it("buildHeatmap marks done days from logs", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 86400000);
    const logs = [
      { date: today, completed: true },
      { date: yesterday, completed: false },
    ];
    const heat = buildHeatmap(logs, 7);
    expect(heat).toHaveLength(7);
    expect(heat[6]!.done).toBe(true);
    expect(heat[5]!.done).toBe(false);
  });

  it("isDoneToday reflects a completed log today", () => {
    const today = new Date();
    expect(
      isDoneToday([{ date: today, completed: true }]),
    ).toBe(true);
    expect(
      isDoneToday([{ date: today, completed: false }]),
    ).toBe(false);
    const yesterday = new Date(Date.now() - 86400000);
    expect(
      isDoneToday([{ date: yesterday, completed: true }]),
    ).toBe(false);
  });
});
