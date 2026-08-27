"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Target, Flame, ListTodo, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalCreateDialog } from "@/components/goals/goal-create-dialog";
import { trpc } from "@/trpc/react";

const priorityVariant: Record<string, "default" | "warning" | "error" | "success"> = {
  LOW: "success",
  MEDIUM: "default",
  HIGH: "warning",
  URGENT: "error",
};

export function Dashboard({ name }: { name: string }) {
  const [taskTitle, setTaskTitle] = useState("");

  const goals = trpc.goal.list.useQuery({ limit: 12, status: "ACTIVE" });
  const habits = trpc.habit.list.useQuery();
  const tasks = trpc.task.list.useQuery({ limit: 6 });
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="h2">Salom, {firstName} 👋</h1>
        <p className="body text-text-secondary">
          {new Date().toLocaleDateString("uz-UZ", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="size-5" />
            </span>
            <div>
              <p className="caption">Faol maqsadlar</p>
              <p className="stat">{goals.data?.goals.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Flame className="size-5" />
            </span>
            <div>
              <p className="caption">Odatlar</p>
              <p className="stat">{habits.data?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <ListTodo className="size-5" />
            </span>
            <div>
              <p className="caption">Vazifalar</p>
              <p className="stat">{tasks.data?.tasks.length ?? 0}</p>
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
                      <p className="caption">
                        {g._count.tasks} ta vazifa
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
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
          ) : tasks.data?.tasks.length ? (
            <motion.div className="space-y-2">
              {tasks.data.tasks.map((t) => (
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
            <Card>
              <EmptyState
                icon={<ListTodo />}
                title="Hali vazifalar yo'q"
                description="Birinchi vazifangizni qo'shing — yuqoridagi maydon orqali tezda qo'shishingiz mumkin."
              />
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
