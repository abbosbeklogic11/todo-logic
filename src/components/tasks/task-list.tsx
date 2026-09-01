"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { trpc, type TaskItem } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskRow } from "./task-row";

export function TaskList({
  tasks,
  onEdit,
}: {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
}) {
  const utils = trpc.useUtils();
  const [quick, setQuick] = useState("");

  const create = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      setQuick("");
    },
  });

  const addQuick = () => {
    const title = quick.trim();
    if (!title) return;
    create.mutate({ title });
  };

  if (tasks.length === 0) {
    return (
      <EmptyState
        image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80&auto=format&fit=crop"
        imageAlt="Bo'sh vazifalar ro'yxati"
        icon={<Plus className="size-5" />}
        title="Vazifalar yo'q"
        description="Yuqoridagi qutiga sarlavha yozing yoki 'Yangi vazifa' tugmasini bosing."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addQuick();
            }
          }}
          placeholder="Tez qo'shish: sarlavhani kiriting va Enter bosing"
          aria-label="Tez qo'shish"
        />
        <Button onClick={addQuick} disabled={create.isPending || !quick.trim()}>
          <Plus className="h-4 w-4" />
          Qo'shish
        </Button>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}
