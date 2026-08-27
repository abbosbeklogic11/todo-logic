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

export function GoalCenter() {
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
          <h1 className="text-2xl font-bold">Maqsadlar</h1>
          <p className="text-sm text-text-muted">{filtered.length} ta ko'rsatilmoqda</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Yangi maqsad
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as GoalStatus | "ALL")}
          aria-label="Holat bo'yicha filtr"
          className="sm:w-52"
        >
          <option value="ALL">Barcha holatlar</option>
          {goalStatusSchema.options.map((s) => (
            <option key={s} value={s}>
              {GOAL_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">Yuklanmoqda...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Target />}
          title="Hali maqsad yo'q"
          description="Katta narsadan boshlang — maqsad yarating va uni bosqichlarga ajrating."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Birinchi maqsad
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
