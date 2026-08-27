"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type TaskItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  monthMatrix,
  WEEKDAYS_SHORT,
  isToday,
  groupTasksByDay,
} from "@/lib/task-utils";
import type { TaskPriority as TP } from "@/lib/schemas/task";

function priorityBorder(p: TP): string {
  switch (p) {
    case "LOW":
      return "border-l-text-muted";
    case "MEDIUM":
      return "border-l-primary";
    case "HIGH":
      return "border-l-warning";
    case "URGENT":
      return "border-l-error";
  }
}

export function TaskCalendar({
  tasks,
  onEdit,
}: {
  tasks: TaskItem[];
  onEdit: (t: TaskItem) => void;
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const weeks = monthMatrix(year, month);
  const grouped = groupTasksByDay(tasks, year, month);

  const prev = () => {
    const d = new Date(year, month - 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const next = () => {
    const d = new Date(year, month + 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const monthLabel = new Date(year, month, 1).toLocaleDateString("uz-UZ", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prev} aria-label="Oldingi oy">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold capitalize">{monthLabel}</h3>
        <Button variant="ghost" size="icon" onClick={next} aria-label="Keyingi oy">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted">
        {WEEKDAYS_SHORT.map((d) => (
          <div key={d} className="py-1 font-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day) => {
          const inMonth = day.getMonth() === month;
          const dayTasks = grouped.get(day.getDate()) ?? [];
          return (
            <div
              key={day.toISOString()}
              className={
                "min-h-[92px] rounded-lg border p-1.5 text-left " +
                (inMonth ? "border-border bg-surface" : "border-transparent bg-surface/40") +
                (isToday(day) ? " ring-2 ring-primary/50" : "")
              }
            >
              <div
                className={
                  "mb-1 text-xs font-medium " +
                  (inMonth ? "text-text" : "text-text-muted")
                }
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onEdit(t)}
                    className={
                      "block w-full truncate rounded border-l-2 px-1 py-0.5 text-left text-[11px] hover:bg-background " +
                      priorityBorder(t.priority)
                    }
                    title={t.title}
                  >
                    {t.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <p className="px-1 text-[10px] text-text-muted">
                    +{dayTasks.length - 3} ta
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
