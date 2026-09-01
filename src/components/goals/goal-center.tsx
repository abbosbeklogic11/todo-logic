"use client";

import { useMemo, useState } from "react";
import { Plus, Target } from "lucide-react";
import { trpc, type GoalItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalCard } from "./goal-card";
import { GoalDialog } from "./goal-dialog";
import { GOAL_STATUS_LABELS } from "@/lib/goal-utils";
import { goalStatusSchema, type GoalStatus } from "@/lib/schemas/goal";
import { useLanguage } from "@/components/language-provider";

export function GoalCenter() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<GoalStatus | "ALL">("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GoalItem | null>(null);

  const { data, isLoading } = trpc.goal.list.useQuery({ limit: 200 });
  const goals = useMemo(() => data?.goals ?? [], [data]);

  const filtered = useMemo(
    () =>
      status === "ALL" ? goals : goals.filter((g) => g.status === status),
    [goals, status],
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (g: GoalItem) => {
    setEditing(g);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("goals.title")}</h1>
          <p className="text-sm text-text-muted">{t("goals.showing", { count: filtered.length })}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {t("goals.create")}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as GoalStatus | "ALL")}
          aria-label={t("goals.filter.aria")}
          className="sm:w-52"
        >
          <option value="ALL">{t("goals.filter.all")}</option>
          {goalStatusSchema.options.map((s) => (
            <option key={s} value={s}>
              {GOAL_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">{t("common.loading")}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop"
          imageAlt="Maqsadlar bo'sh"
          icon={<Target />}
          title={t("goals.empty.title")}
          description={t("goals.empty.description")}
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {t("goals.empty.action")}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((g) => (
            <GoalCard key={g.id} goal={g} onEdit={openEdit} />
          ))}
        </div>
      )}

      <GoalDialog open={dialogOpen} onOpenChange={setDialogOpen} goal={editing} />
    </div>
  );
}
