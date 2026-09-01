"use client";

import { useState } from "react";
import { Plus, Flame } from "lucide-react";
import { trpc, type HabitItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HabitCard } from "./habit-card";
import { HabitDialog } from "./habit-dialog";
import { isDoneToday } from "@/lib/habit-utils";
import { useLanguage } from "@/components/language-provider";

export function HabitCenter() {
  const { t } = useLanguage();
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
          <h1 className="text-2xl font-bold">{t("habits.title")}</h1>
          <p className="text-sm text-text-muted">
            {habits.length > 0 ? t("habits.subtitle.progress", { done: doneToday, total: habits.length }) : t("habits.subtitle.default")}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {t("habits.create")}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">{t("common.loading")}</p>
      ) : habits.length === 0 ? (
        <EmptyState
          image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80&auto=format&fit=crop"
          imageAlt="Odatlar bo'sh"
          icon={<Flame />}
          title={t("habits.empty.title")}
          description={t("habits.empty.description")}
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {t("habits.empty.action")}
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
