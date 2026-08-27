"use client";

import { useState } from "react";
import { Plus, Flame } from "lucide-react";
import { trpc, type HabitItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HabitCard } from "./habit-card";
import { HabitDialog } from "./habit-dialog";
import { isDoneToday } from "@/lib/habit-utils";

export function HabitCenter() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HabitItem | null>(null);

  const { data, isLoading } = trpc.habit.list.useQuery();
  const habits = data ?? [];

  const doneToday = habits.filter((h) => isDoneToday(h.logs)).length;

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (h: HabitItem) => {
    setEditing(h);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Odatlar</h1>
          <p className="text-sm text-text-muted">
            {habits.length > 0
              ? `Bugun ${doneToday}/${habits.length} odat bajarildi`
              : "Kundalik odatlaringizni kuzating"}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Yangi odat
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">Yuklanmoqda...</p>
      ) : habits.length === 0 ? (
        <EmptyState
          icon={<Flame />}
          title="Hali odatlar yo'q"
          description="Kichik, lekin muntazam odat yarating — masalan, su ichish yoki 10 daqiqa o'qish."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Birinchi odat
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onEdit={openEdit} />
          ))}
        </div>
      )}

      <HabitDialog open={dialogOpen} onOpenChange={setDialogOpen} habit={editing} />
    </div>
  );
}
