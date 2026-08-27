"use client";

import { Flame, Pencil, Trash2 } from "lucide-react";
import { trpc, type HabitItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  HABIT_FREQUENCY_LABELS,
  buildHeatmap,
  isDoneToday,
  dayLabel,
} from "@/lib/habit-utils";

export function HabitCard({
  habit,
  onEdit,
}: {
  habit: HabitItem;
  onEdit: (habit: HabitItem) => void;
}) {
  const utils = trpc.useUtils();
  const todayDone = isDoneToday(habit.logs);
  const heatmap = buildHeatmap(habit.logs, 7);

  const toggle = trpc.habit.toggleToday.useMutation({
    onSuccess: () => utils.habit.list.invalidate(),
  });
  const remove = trpc.habit.delete.useMutation({
    onSuccess: () => utils.habit.list.invalidate(),
  });

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{habit.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {HABIT_FREQUENCY_LABELS[habit.frequency] ?? habit.frequency}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Tahrirlash"
              onClick={() => onEdit(habit)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-error"
              aria-label="O'chirish"
              onClick={() => remove.mutate({ id: habit.id })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1 text-warning">
            <Flame className="h-4 w-4" />
            <span className="font-semibold">{habit.streak}</span> kun
          </span>
          <span className="text-text-muted">
            rekord: {habit.bestStreak}
          </span>
        </div>

        <div>
          <p className="mb-1.5 text-xs text-text-muted">So'nggi 7 kun</p>
          <div className="flex gap-1.5">
            {heatmap.map((d) => (
              <div key={d.date.toISOString()} className="flex flex-col items-center gap-1">
                <div
                  className={
                    "size-7 rounded-md border " +
                    (d.done
                      ? "border-primary bg-primary"
                      : "border-border bg-surface")
                  }
                  title={d.date.toLocaleDateString("uz-UZ")}
                  aria-label={d.done ? "Bajarilgan" : "Bajarilmagan"}
                />
                <span className="text-[10px] text-text-muted">{dayLabel(d.date)}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant={todayDone ? "secondary" : "primary"}
          className="w-full"
          aria-pressed={todayDone}
          onClick={() => toggle.mutate({ habitId: habit.id })}
        >
          {todayDone ? "Bugun bajarildi ✓" : "Bugun bajardim"}
        </Button>
      </CardContent>
    </Card>
  );
}
