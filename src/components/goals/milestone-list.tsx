"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { trpc } from "@/trpc/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Milestone = {
  id: string;
  title: string;
  isCompleted: boolean;
  order: number;
};

export function MilestoneList({
  goalId,
  milestones,
}: {
  goalId: string;
  milestones: Milestone[];
}) {
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");

  const invalidate = () => utils.goal.list.invalidate();

  const add = trpc.goal.addMilestone.useMutation({ onSuccess: invalidate });
  const toggle = trpc.goal.toggleMilestone.useMutation({ onSuccess: invalidate });

  const addMilestone = () => {
    const value = title.trim();
    if (!value) return;
    add.mutate({ goalId, title: value });
    setTitle("");
  };

  const done = milestones.filter((m) => m.isCompleted).length;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Bosqichlar ({done}/{milestones.length})
      </p>
      <ul className="space-y-1">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-center gap-2">
            <Checkbox
              checked={m.isCompleted}
              onCheckedChange={(c) =>
                toggle.mutate({ id: m.id, isCompleted: !!c })
              }
              aria-label={m.title}
            />
            <span
              className={
                "flex-1 text-sm " +
                (m.isCompleted ? "text-text-muted line-through" : "")
              }
            >
              {m.title}
            </span>
          </li>
        ))}
        {milestones.length === 0 && (
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
              addMilestone();
            }
          }}
          placeholder="Bosqich qo'shish"
          aria-label="Bosqich nomi"
        />
        <Button
          type="button"
          size="sm"
          onClick={addMilestone}
          disabled={add.isPending}
        >
          <Plus className="h-4 w-4" />
          Qo'shish
        </Button>
      </div>
    </div>
  );
}
