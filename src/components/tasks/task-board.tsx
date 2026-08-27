"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, CalendarDays } from "lucide-react";
import { trpc, type TaskItem } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import {
  BOARD_COLUMNS,
  STATUS_LABELS,
  priorityVariant,
  PRIORITY_LABELS,
  formatDueDate,
  isOverdue,
  type BadgeVariant,
} from "@/lib/task-utils";
import type { TaskStatus } from "@/lib/schemas/task";

function groupByStatus(tasks: TaskItem[]): Record<TaskStatus, TaskItem[]> {
  const result: Record<TaskStatus, TaskItem[]> = {
    TODO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    ARCHIVED: [],
  };
  for (const t of tasks) {
    result[t.status].push(t);
  }
  return result;
}

function BoardCard({
  task,
  onEdit,
}: {
  task: TaskItem;
  onEdit: (t: TaskItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const completed = task.status === "COMPLETED";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "flex items-start gap-2 rounded-lg border border-border bg-surface p-3 shadow-sm " +
        (isDragging ? "opacity-60" : "")
      }
    >
      <button
        type="button"
        className="mt-0.5 cursor-grab touch-none text-text-muted"
        aria-label="Sudrab ko'chirish"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onEdit(task)} className="flex-1 text-left">
        <p className={completed ? "text-text-muted line-through" : "font-medium"}>
          {task.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant={priorityVariant(task.priority) as BadgeVariant}>
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
        </div>
      </button>
    </div>
  );
}

export function TaskBoard({
  tasks,
  onEdit,
}: {
  tasks: TaskItem[];
  onEdit: (t: TaskItem) => void;
}) {
  const utils = trpc.useUtils();
  const [items, setItems] = useState<TaskItem[]>(tasks);

  useEffect(() => setItems(tasks), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const update = trpc.task.update.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });
  const reorder = trpc.task.reorder.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const prev = items;
    const activeIndex = prev.findIndex((t) => t.id === activeId);
    if (activeIndex < 0) return;
    const moved = prev[activeIndex];
    if (!moved) return;
    const oldStatus = moved.status;

    let newStatus: TaskStatus = oldStatus;
    const overTask = prev.find((t) => t.id === overId);
    const overIndex = prev.findIndex((t) => t.id === overId);
    const next = [...prev];
    next.splice(activeIndex, 1);
    const updated = { ...moved, status: newStatus };

    if (overId.startsWith("col-")) {
      newStatus = overId.slice(4) as TaskStatus;
      updated.status = newStatus;
      const lastIdx = next.reduce(
        (acc, t, i) => (t.status === newStatus ? i : acc),
        -1,
      );
      const insertAt = lastIdx === -1 ? next.length : lastIdx + 1;
      next.splice(insertAt, 0, updated);
    } else {
      if (overIndex < 0 || !overTask) return;
      newStatus = overTask.status;
      updated.status = newStatus;
      next.splice(overIndex, 0, updated);
    }

    setItems(next);

    if (oldStatus !== newStatus) {
      update.mutate({ id: activeId, status: newStatus });
    }
    reorder.mutate({
      ids: next.filter((t) => t.status === newStatus).map((t) => t.id),
    });
    if (oldStatus !== newStatus) {
      reorder.mutate({
        ids: next.filter((t) => t.status === oldStatus).map((t) => t.id),
      });
    }
  };

  const grouped = useMemo(() => groupByStatus(items), [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {BOARD_COLUMNS.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={grouped[status]}
            onEdit={onEdit}
          />
        ))}
      </div>
    </DndContext>
  );
}

function Column({
  status,
  tasks,
  onEdit,
}: {
  status: TaskStatus;
  tasks: TaskItem[];
  onEdit: (t: TaskItem) => void;
}) {
  const { setNodeRef } = useSortable({ id: `col-${status}` });
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
        <span className="text-xs text-text-muted">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="space-y-2 min-h-[60px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((t) => (
            <BoardCard key={t.id} task={t} onEdit={onEdit} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-text-muted">
            Vazifa yo'q
          </p>
        )}
      </div>
    </div>
  );
}
