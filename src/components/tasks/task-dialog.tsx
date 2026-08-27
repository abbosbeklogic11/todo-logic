"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { trpc, type TaskItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubtaskEditor } from "./subtask-editor";
import { PRIORITY_LABELS } from "@/lib/task-utils";
import { taskPrioritySchema, type TaskPriority } from "@/lib/schemas/task";

function toDateInput(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskItem | null;
}) {
  const utils = trpc.useUtils();
  const isEdit = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueAt, setDueAt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [goalId, setGoalId] = useState("");
  const [tagNames, setTagNames] = useState("");
  const [draftSubtasks, setDraftSubtasks] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const categories = trpc.category.list.useQuery(undefined, { enabled: open });
  const goals = trpc.goal.list.useQuery({}, { enabled: open });

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "MEDIUM");
    setDueAt(toDateInput(task?.dueAt));
    setCategoryId(task?.category?.id ?? "");
    setGoalId(task?.goalId ?? "");
    setTagNames(
      (task?.tags ?? [])
        .map((t) => t.tag?.name)
        .filter(Boolean)
        .join(", "),
    );
    setDraftSubtasks([]);
    setServerError(null);
  }, [open, task]);

  const create = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => setServerError(e.message),
  });

  const update = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      utils.task.byId.invalidate({ id: task!.id });
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
      priority,
      dueAt: dueAt ? new Date(dueAt) : undefined,
      categoryId: categoryId || undefined,
      goalId: goalId || undefined,
      tagNames: tagNames
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (isEdit) {
      update.mutate({ id: task!.id, ...payload });
    } else {
      create.mutate({
        ...payload,
        subtasks: draftSubtasks
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => ({ title: t })),
      });
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Vazifani tahrirlash" : "Yangi vazifa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Sarlavha</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vazifa nomini kiriting"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Tavsif</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ixtiyoriy tavsif"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-priority">Muhimlik</Label>
              <Select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                {taskPrioritySchema.options.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Muddat</Label>
              <Input
                id="task-due"
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-category">Kategoriya</Label>
              <Select
                id="task-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">—</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-goal">Maqsad</Label>
              <Select
                id="task-goal"
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
              >
                <option value="">—</option>
                {goals.data?.goals?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-tags">Teglar (vergul bilan)</Label>
            <Input
              id="task-tags"
              value={tagNames}
              onChange={(e) => setTagNames(e.target.value)}
              placeholder="ish, shaxsiy"
            />
          </div>

          {isEdit ? (
            <SubtaskEditor taskId={task!.id} subtasks={task!.subtasks} />
          ) : (
            <div className="space-y-2">
              <Label>Kichik vazifalar</Label>
              <ul className="space-y-1">
                {draftSubtasks.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{s}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      aria-label="O'chirish"
                      onClick={() =>
                        setDraftSubtasks((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      ✕
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
                    if (v) setDraftSubtasks((prev) => [...prev, v]);
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
