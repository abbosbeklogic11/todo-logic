"use client";

import { useState } from "react";
import { Target, CalendarDays, ListChecks, Pencil, Trash2, ChevronDown, Plus } from "lucide-react";
import { trpc, type GoalItem } from "@/trpc/react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MilestoneList } from "./milestone-list";
import {
  GOAL_STATUS_LABELS,
  goalStatusVariant,
  formatTargetDate,
  isGoalOverdue,
} from "@/lib/goal-utils";

export function GoalCard({
  goal,
  onEdit,
}: {
  goal: GoalItem;
  onEdit: (goal: GoalItem) => void;
}) {
  const utils = trpc.useUtils();
  const [expanded, setExpanded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.goal.list.invalidate();
      setNewTaskTitle("");
    },
  });

  const doneM = goal.milestones.filter((m) => m.isCompleted).length;
  const remove = trpc.goal.delete.useMutation({
    onSuccess: () => utils.goal.list.invalidate(),
  });

  const overdue = isGoalOverdue(goal.targetDate, goal.status);

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-4">
          <ProgressRing value={Math.round(goal.progress)} size={64} strokeWidth={6} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{goal.title}</h3>
              <div className="flex items-center gap-1">
                {goal.milestones.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={expanded ? "Yig'ish" : "Yoyish"}
                    aria-expanded={expanded}
                    onClick={() => setExpanded((v) => !v)}
                  >
                    <ChevronDown
                      className={"h-4 w-4 transition-transform " + (expanded ? "rotate-180" : "")}
                    />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Tahrirlash"
                  onClick={() => onEdit(goal)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-error"
                  aria-label="O'chirish"
                  onClick={() => remove.mutate({ id: goal.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={goalStatusVariant(goal.status)}>
                {GOAL_STATUS_LABELS[goal.status]}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <ListChecks className="h-3.5 w-3.5" />
                {doneM}/{goal.milestones.length} bosqich
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <Target className="h-3.5 w-3.5" />
                {goal._count.tasks} ta vazifa
              </span>
              {goal.targetDate && (
                <span
                  className={
                    "inline-flex items-center gap-1 text-xs " +
                    (overdue ? "text-error" : "text-text-muted")
                  }
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatTargetDate(goal.targetDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        {goal.description && (
          <p className="text-sm text-text-muted">{goal.description}</p>
        )}
        {expanded && (
          <div className="border-t border-border space-y-4 pt-3">
            <MilestoneList goalId={goal.id} milestones={goal.milestones} />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Vazifalar ({goal._count.tasks} ta)</p>
              <div className="flex items-center gap-2">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = newTaskTitle.trim();
                      if (v) createTask.mutate({ title: v, goalId: goal.id });
                    }
                  }}
                  placeholder="Vazifa qo'shish — Enter"
                  className="h-9 text-sm"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const v = newTaskTitle.trim();
                    if (v) createTask.mutate({ title: v, goalId: goal.id });
                  }}
                  disabled={createTask.isPending || !newTaskTitle.trim()}
                >
                  <Plus className="h-4 w-4" /> Qo'shish
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
