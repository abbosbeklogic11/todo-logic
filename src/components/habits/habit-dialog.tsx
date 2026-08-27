"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { trpc, type HabitItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HABIT_FREQUENCY_LABELS } from "@/lib/habit-utils";

const FREQUENCIES = ["daily", "weekly", "custom"] as const;

export function HabitDialog({
  open,
  onOpenChange,
  habit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: HabitItem | null;
}) {
  const utils = trpc.useUtils();
  const isEdit = !!habit;

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number]>("daily");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(habit?.name ?? "");
    setFrequency((habit?.frequency as (typeof FREQUENCIES)[number]) ?? "daily");
    setServerError(null);
  }, [open, habit]);

  const create = trpc.habit.create.useMutation({
    onSuccess: () => {
      utils.habit.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => setServerError(e.message),
  });
  const update = trpc.habit.update.useMutation({
    onSuccess: () => {
      utils.habit.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => setServerError(e.message),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const title = name.trim();
    if (!title) return;
    if (isEdit) {
      update.mutate({ id: habit!.id, name: title, frequency });
    } else {
      create.mutate({ name: title, frequency });
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Odatni tahrirlash" : "Yangi odat"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="habit-name">Nomi</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Su ichish, Sport, O'qish"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="habit-freq">Davriylik</Label>
            <Select
              id="habit-freq"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as (typeof FREQUENCIES)[number])
              }
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {HABIT_FREQUENCY_LABELS[f]}
                </option>
              ))}
            </Select>
          </div>
          {serverError && (
            <p className="text-sm text-error" role="alert">
              {serverError}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={pending || !name.trim()}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Saqlash" : "Yaratish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
