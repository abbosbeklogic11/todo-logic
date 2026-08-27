"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { trpc } from "@/trpc/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Subtask = { id: string; title: string; isCompleted: boolean; position: number };

export function SubtaskEditor({
  taskId,
  subtasks,
}: {
  taskId: string;
  subtasks: Subtask[];
}) {
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");

  const invalidate = () => {
    utils.task.byId.invalidate({ id: taskId });
    utils.task.list.invalidate();
  };

  const create = trpc.task.subtasks.create.useMutation({
    onSuccess: invalidate,
  });
  const toggle = trpc.task.subtasks.toggle.useMutation({ onSuccess: invalidate });
  const remove = trpc.task.subtasks.delete.useMutation({ onSuccess: invalidate });

  const add = () => {
    const value = title.trim();
    if (!value) return;
    create.mutate({ taskId, title: value });
    setTitle("");
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Kichik vazifalar
      </p>
      <ul className="space-y-1">
        {subtasks.map((s) => (
          <li key={s.id} className="flex items-center gap-2">
            <Checkbox
              checked={s.isCompleted}
              onCheckedChange={(c) => toggle.mutate({ id: s.id, done: !!c })}
              aria-label={s.title}
            />
            <span
              className={
                "flex-1 text-sm " + (s.isCompleted ? "text-text-muted line-through" : "")
              }
            >
              {s.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="O'chirish"
              onClick={() => remove.mutate({ id: s.id })}
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
        {subtasks.length === 0 && (
          <li className="text-sm text-text-muted">Hali qo'shilmagan</li>
        )}
      </ul>
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Kichik vazifa qo'shish"
          aria-label="Kichik vazifa nomi"
        />
        <Button type="button" size="sm" onClick={add} disabled={create.isPending}>
          <Plus className="h-4 w-4" />
          Qo'shish
        </Button>
      </div>
    </div>
  );
}
