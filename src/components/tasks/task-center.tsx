"use client";

import { useMemo, useState } from "react";
import { List, LayoutGrid, CalendarDays, Plus, Search } from "lucide-react";
import { trpc, type TaskItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TaskList } from "./task-list";
import { TaskBoard } from "./task-board";
import { TaskCalendar } from "./task-calendar";
import { TaskDialog } from "./task-dialog";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/task-utils";
import {
  taskPrioritySchema,
  taskStatusSchema,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/schemas/task";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

type View = "list" | "board" | "calendar";

export function TaskCenter() {
  const { t } = useLanguage();
  const VIEWS: { id: View; label: string; icon: typeof List }[] = [
    { id: "list", label: t("tasks.views.list"), icon: List },
    { id: "board", label: t("tasks.views.board"), icon: LayoutGrid },
    { id: "calendar", label: t("tasks.views.calendar"), icon: CalendarDays },
  ];
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<TaskPriority | "ALL">("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);

  const { data, isLoading } = trpc.task.list.useQuery({ limit: 200 });
  const tasks = useMemo(() => data?.tasks ?? [], [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (status !== "ALL" && t.status !== status) return false;
      if (priority !== "ALL" && t.priority !== priority) return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, search, status, priority]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (t: TaskItem) => {
    setEditing(t);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl">{t("tasks.title")}</h1>
          <p className="text-sm text-text-muted">{t("tasks.showing", { count: filtered.length })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-surface p-1">
            {VIEWS.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  aria-pressed={view === v.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3",
                    view === v.id ? "bg-primary text-primary-foreground" : "text-text-muted hover:text-text",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xs:inline sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
          <Button onClick={openCreate} className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t("tasks.create")}</span>
            <span className="sm:hidden">{t("tasks.create.new")}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("tasks.search.placeholder")}
            className="pl-9"
            aria-label={t("tasks.search.aria")}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus | "ALL")}
          aria-label={t("tasks.filter.status.aria")}
          className="sm:w-44"
        >
          <option value="ALL">{t("tasks.filter.status.all")}</option>
          {taskStatusSchema.options.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority | "ALL")}
          aria-label={t("tasks.filter.priority.aria")}
          className="sm:w-44"
        >
          <option value="ALL">{t("tasks.filter.priority.all")}</option>
          {taskPrioritySchema.options.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">{t("common.loading")}</p>
      ) : view === "list" ? (
        <TaskList tasks={filtered} onEdit={openEdit} />
      ) : view === "board" ? (
        <TaskBoard tasks={filtered} onEdit={openEdit} />
      ) : (
        <TaskCalendar tasks={filtered} onEdit={openEdit} />
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editing}
      />
    </div>
  );
}
