"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { trpc, type GoalItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MilestoneList } from "./milestone-list";
import { GOAL_STATUS_LABELS } from "@/lib/goal-utils";
import { goalStatusSchema, type GoalStatus } from "@/lib/schemas/goal";

function toDateInput(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function GoalDialog({
  open,
  onOpenChange,
  goal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: GoalItem | null;
}) {
  const utils = trpc.useUtils();
  const isEdit = !!goal;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [status, setStatus] = useState<GoalStatus>("ACTIVE");
  const [draftMilestones, setDraftMilestones] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(goal?.title ?? "");
    setDescription(goal?.description ?? "");
    setTargetDate(toDateInput(goal?.targetDate));
    setStatus(goal?.status ?? "ACTIVE");
    setDraftMilestones([]);
    setServerError(null);
  }, [open, goal]);

  const create = trpc.goal.create.useMutation({
    onSuccess: () => {
      utils.goal.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => setServerError(e.message),
  });

  const update = trpc.goal.update.useMutation({
    onSuccess: () => {
      utils.goal.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => setServerError(e.message),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate ? new Date(targetDate) : undefined,
    };
    if (isEdit) {
      update.mutate({ id: goal!.id, ...payload, status });
    } else {
      create.mutate({
        ...payload,
        milestones: draftMilestones
          .map((t) => t.trim())
          .filter(Boolean),
      });
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Maqsadni tahrirlash" : "Yangi maqsad"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal-title">Nomi</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Maqsad nomini kiriting"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-desc">Tavsif</Label>
            <Textarea
              id="goal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ixtiyoriy tavsif"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="goal-target">Muddat</Label>
              <Input
                id="goal-target"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
            {isEdit && (
              <div className="space-y-1.5">
                <Label htmlFor="goal-status">Holat</Label>
                <Select
                  id="goal-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GoalStatus)}
                >
                  {goalStatusSchema.options.map((s) => (
                    <option key={s} value={s}>
                      {GOAL_STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {isEdit ? (
            <MilestoneList goalId={goal!.id} milestones={goal!.milestones} />
          ) : (
            <div className="space-y-2">
              <Label>Bosqichlar</Label>
              <ul className="space-y-1">
                {draftMilestones.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{s}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      aria-label="O'chirish"
                      onClick={() =>
                        setDraftMilestones((prev) =>
                          prev.filter((_, j) => j !== i),
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <Input
                placeholder="Qo'shish uchun kiriting va Enter bosing"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = e.currentTarget.value.trim();
                    if (v) setDraftMilestones((prev) => [...prev, v]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          )}

          {serverError && (
            <p className="text-sm text-error" role="alert">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={pending || !title.trim()}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Saqlash" : "Yaratish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
