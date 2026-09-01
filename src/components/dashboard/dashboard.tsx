"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Target,
  Flame,
  ListTodo,
  ArrowRight,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalCreateDialog } from "@/components/goals/goal-create-dialog";
import { trpc } from "@/trpc/react";
import { isOverdue, dueLabel } from "@/lib/task-utils";

const priorityVariant: Record<string, "default" | "warning" | "error" | "success"> = {
  LOW: "success",
  MEDIUM: "default",
  HIGH: "warning",
  URGENT: "error",
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Dashboard({ name }: { name: string }) {
  const [taskTitle, setTaskTitle] = useState("");

  const goals = trpc.goal.list.useQuery({ limit: 12, status: "ACTIVE" });
  const habits = trpc.habit.list.useQuery();
  const tasks = trpc.task.list.useQuery({ limit: 50 });
  const utils = trpc.useUtils();

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      setTaskTitle("");
    },
  });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;
    createTask.mutate({ title });
  };

  const firstName = name?.split(" ")[0] ?? "Foydalanuvchi";

  const allTasks = tasks.data?.tasks ?? [];
  const today = new Date();
  const activeTasks = allTasks.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "ARCHIVED",
  ).length;
  const completedToday = allTasks.filter(
    (t) =>
      t.status === "COMPLETED" &&
      t.completedAt &&
      isSameDay(new Date(t.completedAt), today),
  ).length;
  const upcoming = allTasks
    .filter((t) => t.status !== "COMPLETED" && t.dueAt)
    .sort(
      (a, b) =>
        new Date(a.dueAt as string).getTime() -
        new Date(b.dueAt as string).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200&q=80&auto=format&fit=crop"
          alt="Dashboard banner"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/80" />
        <div className="relative p-6 sm:p-8">
          <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">Salom, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-white/90 sm:text-base">
            {new Date().toLocaleDateString("uz-UZ", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="mt-3 hidden max-w-2xl text-sm text-white/80 sm:block">
            Bugungi rejalaringizni ko'rib chiqing, vazifalarni bajaring va maqsadlaringiz sari yaqinlashing.
          </p>
        </div>
      </div>

      {/* Stats — 3D weather card uslubida */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-lg">
              <ListTodo className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-text-muted">Faol vazifalar</p>
              <p className="text-2xl font-bold">{activeTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg">
              <CheckCircle2 className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-text-muted">Bugun bajarilgan</p>
              <p className="text-2xl font-bold">{completedToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white shadow-lg">
              <Target className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-text-muted">Faol maqsadlar</p>
              <p className="text-2xl font-bold">{goals.data?.goals.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#be185d] text-white shadow-lg">
              <Flame className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-text-muted">Odatlar</p>
              <p className="text-2xl font-bold">{habits.data?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Goals */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="h4">Maqsadlar</h2>
            <div className="flex items-center gap-1">
              <Link
                href="/goals"
                className="caption inline-flex items-center gap-1 hover:text-text"
              >
                Barchasi <ArrowRight className="size-4" />
              </Link>
              <GoalCreateDialog
                trigger={
                  <Button size="sm" variant="ghost">
                    <Plus className="size-4" /> Yangi
                  </Button>
                }
              />
            </div>
          </div>
          {goals.isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-hover" />
              ))}
            </div>
          ) : goals.data?.goals.length ? (
            <div className="space-y-3">
              {goals.data.goals.map((g) => (
                <Card key={g.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <ProgressRing value={g.progress} size={56} strokeWidth={6} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{g.title}</p>
                      <p className="caption">{g._count.tasks} ta vazifa</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <EmptyState
                image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop"
                imageAlt="Maqsadlar"
                icon={<Target />}
                title="Katta narsadan boshlang"
                description="Birinchi maqsadingizni yarating va uni bosqichlarga ajrating."
                action={<GoalCreateDialog />}
              />
            </Card>
          )}
        </section>

        {/* Tasks */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="h4">Vazifalar</h2>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/tasks">
                Barchasi <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <form onSubmit={addTask} className="mb-3 flex gap-2">
            <Input
              placeholder="Tez qo'shish…"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Button type="submit" size="icon" aria-label="Qo'shish">
              <Plus className="size-4" />
            </Button>
          </form>

          {tasks.isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-md bg-surface-hover" />
              ))}
            </div>
          ) : allTasks.length ? (
            <motion.div className="space-y-2">
              {allTasks.slice(0, 5).map((t) => (
                <Card key={t.id}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="size-4 rounded-md border-2 border-border" />
                    <span className="flex-1 truncate text-sm">{t.title}</span>
                    <Badge variant={priorityVariant[t.priority] ?? "default"}>
                      {t.priority}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <Card className="overflow-hidden">
              <EmptyState
                image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80&auto=format&fit=crop"
                imageAlt="Vazifalar"
                icon={<ListTodo />}
                title="Hali vazifalar yo'q"
                description="Birinchi vazifangizni qo'shing — yuqoridagi maydon orqali tezda qo'shishingiz mumkin."
              />
            </Card>
          )}
        </section>
      </div>

      {/* Upcoming deadlines */}
      {upcoming.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="h4 inline-flex items-center gap-2">
              <CalendarClock className="size-5" /> Yaqinlashayotgan muddatlar
            </h2>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/tasks">
                Barchasi <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((t) => {
              const overdue = isOverdue(t.dueAt);
              return (
                <Card key={t.id}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t.title}</p>
                      <p
                        className={
                          "caption " + (overdue ? "text-error" : "text-text-muted")
                        }
                      >
                        {dueLabel(t.dueAt)}
                      </p>
                    </div>
                    <Badge variant={priorityVariant[t.priority] ?? "default"}>
                      {t.priority}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
