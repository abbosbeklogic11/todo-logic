"use client";

import { useState } from "react";
import { CalendarDays, ListChecks, Pencil, Trash2, ChevronDown } from "lucide-react";
import { trpc, type TaskItem } from "@/trpc/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubtaskEditor } from "./subtask-editor";
import {
  priorityVariant,
  PRIORITY_LABELS,
  formatDueDate,
  isOverdue,
} from "@/lib/task-utils";

export function TaskRow({
  task,
  onEdit,
}: {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
}) {
  const utils = trpc.useUtils();
  const [expanded, setExpanded] = useState(false);

  const completed = task.status === "COMPLETED";
  const doneSubs = task.subtasks.filter((s) => s.isCompleted).length;

  const toggle = trpc.task.toggleComplete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });
  const remove = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  return (
    <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={completed}
          onCheckedChange={(c) =>
            toggle.mutate({ id: task.id, completed: !!c })
          }
          aria-label={completed ? "Bajarilmagan qilib belgilash" : "Bajarildi"}
          className="mt-1"
        />
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="flex-1 text-left"
        >
          <span
            className={
              "font-medium " + (completed ? "text-text-muted line-through" : "")
            }
          >
            {task.title}
          </span>
          {task.description && (
            <p className="mt-0.5 line-clamp-1 text-sm text-text-muted">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={priorityVariant(task.priority)}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            {task.category && (
              <Badge variant="secondary">{task.category.name}</Badge>
            )}
            {task.dueAt && (
              <span
                className={
                  "inline-flex items-center gap-1 text-xs " +
                  (isOverdue(task.dueAt) && !completed
                    ? "text-error"
                    : "text-text-muted")
                }
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDueDate(task.dueAt)}
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <ListChecks className="h-3.5 w-3.5" />
                {doneSubs}/{task.subtasks.length}
              </span>
            )}
          </div>
        </button>
        <div className="flex items-center gap-1">
          {task.subtasks.length > 0 && (
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
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-error"
            aria-label="O'chirish"
            onClick={() => remove.mutate({ id: task.id })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {expanded && task.subtasks.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <SubtaskEditor taskId={task.id} subtasks={task.subtasks} />
        </div>
      )}
    </div>
  );
}
