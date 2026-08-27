import { describe, it, expect } from "vitest";
import {
  GOAL_STATUS_LABELS,
  goalStatusVariant,
  isGoalOverdue,
} from "@/lib/goal-utils";

describe("goal-utils", () => {
  it("maps all goal statuses to labels and variants", () => {
    expect(GOAL_STATUS_LABELS.ACTIVE).toBe("Faol");
    expect(GOAL_STATUS_LABELS.PAUSED).toBe("To'xtatilgan");
    expect(GOAL_STATUS_LABELS.COMPLETED).toBe("Bajarilgan");
    expect(GOAL_STATUS_LABELS.ARCHIVED).toBe("Arxivlangan");
    expect(goalStatusVariant("ACTIVE")).toBe("success");
    expect(goalStatusVariant("PAUSED")).toBe("warning");
    expect(goalStatusVariant("COMPLETED")).toBe("info");
    expect(goalStatusVariant("ARCHIVED")).toBe("secondary");
  });

  it("isGoalOverdue respects status and date", () => {
    expect(isGoalOverdue(null, "ACTIVE")).toBe(false);
    expect(isGoalOverdue(new Date(Date.now() - 1).toISOString(), "COMPLETED")).toBe(
      false,
    );
    expect(isGoalOverdue(new Date(Date.now() + 86400000).toISOString(), "ACTIVE")).toBe(
      false,
    );
    expect(isGoalOverdue(new Date(Date.now() - 86400000).toISOString(), "ACTIVE")).toBe(
      true,
    );
  });
});
