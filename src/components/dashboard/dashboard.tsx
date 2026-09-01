"use client";

import { useState, useMemo } from "react";
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
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
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

const COLORS = ["#7c3aed", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#3b82f6"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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
  const activeTasks = allTasks.filter((t) => t.status !== "COMPLETED" && t.status !== "ARCHIVED").length;
  const completedToday = allTasks.filter(
    (t) => t.status === "COMPLETED" && t.completedAt && isSameDay(new Date(t.completedAt), today),
  ).length;
  const upcoming = allTasks
    .filter((t) => t.status !== "COMPLETED" && t.dueAt)
    .sort((a, b) => new Date(a.dueAt as string).getTime() - new Date(b.dueAt as string).getTime())
    .slice(0, 6);

  const tasksByPriority = useMemo(() => {
    const counts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
    allTasks.forEach((t) => {
      counts[t.priority] = (counts[t.priority] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: COLORS[Object.keys(counts).indexOf(name)] }));
  }, [allTasks]);

  const last7Days = useMemo(() => {
    const days: { name: string; tasks: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString("uz-UZ", { weekday: "short" });
      const count = allTasks.filter((t) => {
        if (!t.createdAt) return false;
        const cd = new Date(t.createdAt);
        return isSameDay(cd, d);
      }).length;
      days.push({ name: label, tasks: count });
    }
    return days;
  }, [allTasks, today]);

  const kpiData = [
    { name: "Data #1", value: 96, fill: "#7c3aed" },
    { name: "Data #2", value: 75, fill: "#f59e0b" },
    { name: "Data #3", value: 50, fill: "#10b981" },
    { name: "Data #4", value: 85, fill: "#06b6d4" },
  ];

  const goalProgressData = (goals.data?.goals ?? []).slice(0, 4).map((g, i) => ({
    id: g.id,
    name: g.title.slice(0, 12),
    value: g.progress,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="glass-strong rounded-[32px] p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200&q=80&auto=format&fit=crop"
          alt="Dashboard banner"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/90 via-[#7c3aed]/80 to-[#a78bfa]/80" />
        <div className="relative p-6 sm:p-8">
          <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">Salom, {firstName} 👋</h1>
          <p suppressHydrationWarning className="mt-1 text-sm text-white/90 sm:text-base">
            {new Date().toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p className="mt-3 hidden max-w-2xl text-sm text-white/80 sm:block">
            Bugungi rejalaringizni ko&apos;rib chiqing, vazifalarni bajaring va maqsadlaringiz sari yaqinlashing.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass rounded-2xl">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-lg">
              <ListTodo className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-[#9ca3af] dark:text-[#7c86b0]">Faol vazifalar</p>
              <p className="text-2xl font-bold">{activeTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass rounded-2xl">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#34d399] text-white shadow-lg">
              <CheckCircle2 className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-[#9ca3af] dark:text-[#7c86b0]">Bugun bajarilgan</p>
              <p className="text-2xl font-bold">{completedToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass rounded-2xl">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white shadow-lg">
              <Target className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-[#9ca3af] dark:text-[#7c86b0]">Faol maqsadlar</p>
              <p className="text-2xl font-bold">{goals.data?.goals.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass rounded-2xl">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#f472b6] text-white shadow-lg">
              <Flame className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium text-[#9ca3af] dark:text-[#7c86b0]">Odatlar</p>
              <p className="text-2xl font-bold">{habits.data?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="glass rounded-2xl lg:col-span-8">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Overview</h3>
              <span className="flex items-center gap-1 text-xs text-[#9ca3af]">
                <BarChart3 className="size-4" /> Oxirgi 7 kun
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-[#f5f3ff] pb-4">
              <div>
                <p className="text-xs text-[#9ca3af]">Jami</p>
                <p className="text-lg font-bold text-[#7c3aed]">{allTasks.length} ta</p>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af]">Faol</p>
                <p className="text-lg font-bold text-[#f59e0b]">{activeTasks} ta</p>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af]">Bajarildi</p>
                <p className="text-lg font-bold text-[#10b981]">{allTasks.length - activeTasks} ta</p>
              </div>
            </div>
            <div className="h-[180px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ede9fe" }} />
                  <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
                    {last7Days.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl lg:col-span-4">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">KPI Dashboard</h3>
              <span className="rounded-full bg-[#f5f3ff] px-2 py-1 text-xs text-[#7c3aed]">19</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {kpiData.map((k) => (
                <div key={k.name} className="rounded-2xl bg-[#f9f8ff] p-3">
                  <div className="mx-auto size-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={[{ value: k.value }, { value: 100 - k.value }]}
                          innerRadius={22}
                          outerRadius={30}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill={k.fill} />
                          <Cell fill="#ede9fe" />
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                    <p className="relative -mt-[42px] text-center text-xs font-bold" style={{ color: k.fill }}>
                      {k.value}%
                    </p>
                  </div>
                  <p className="mt-1 text-center text-xs text-[#6b7280]">{k.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-[#f5f3ff] p-3 text-center">
              <p className="text-xs text-[#6b7280]">▲ 277.2M</p>
              <p className="text-[11px] text-[#9ca3af]">Jami ko&apos;rsatkich</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="glass rounded-2xl lg:col-span-5">
          <CardContent className="p-5 sm:p-6">
            <h3 className="font-semibold">Maqsadlar bo&apos;yicha</h3>
            <p className="text-xs text-[#9ca3af]">Har bir maqsad progressi</p>
            <div className="mt-4 h-[180px]">
              {goalProgressData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="20%" outerRadius="90%" data={goalProgressData} startAngle={180} endAngle={0}>
                    <RadialBar dataKey="value" cornerRadius={8} />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#9ca3af]">Ma&apos;lumot yo&apos;q</div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {goalProgressData.map((g) => (
                <span key={g.id} className="inline-flex items-center gap-1.5 text-xs">
                  <span className="size-2 rounded-full" style={{ background: g.fill }} />
                  {g.name}: {g.value}%
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl lg:col-span-4">
          <CardContent className="p-5 sm:p-6">
            <h3 className="font-semibold">Vazifalar taqsimoti</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={tasksByPriority} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {tasksByPriority.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {tasksByPriority.map((p) => (
                <span key={p.name} className="inline-flex items-center gap-1.5 text-xs">
                  <span className="size-2 rounded-full" style={{ background: p.fill }} />
                  {p.name} ({p.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl lg:col-span-3">
          <CardContent className="p-5 sm:p-6">
            <h3 className="font-semibold">Haftalik trend</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="tasks" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="size-3 text-[#7c3aed]" /> O&apos;sish
              </span>
              <span className="text-[#9ca3af]">{last7Days.reduce((s, d) => s + d.tasks, 0)} ta / hafta</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Maqsadlar</h2>
            <div className="flex items-center gap-1">
              <Link href="/goals" className="inline-flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#7c3aed]">
                Barchasi <ArrowRight className="size-4" />
              </Link>
              <GoalCreateDialog trigger={<Button size="sm" variant="ghost"><Plus className="size-4" /> Yangi</Button>} />
            </div>
          </div>
          {goals.isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#ede9fe]" />
              ))}
            </div>
          ) : goals.data?.goals.length ? (
            <div className="space-y-3">
              {goals.data.goals.map((g) => (
                <Card key={g.id} className="glass rounded-2xl">
                  <CardContent className="flex items-center gap-4 p-4">
                    <ProgressRing value={g.progress} size={56} strokeWidth={6} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{g.title}</p>
                      <p className="text-xs text-[#9ca3af]">{g._count.tasks} ta vazifa</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden rounded-2xl">
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

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Vazifalar</h2>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/tasks">Barchasi <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <form onSubmit={addTask} className="mb-3 flex gap-2">
            <Input placeholder="Tez qo'shish…" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            <Button type="submit" size="icon" aria-label="Qo'shish">
              <Plus className="size-4" />
            </Button>
          </form>
          {tasks.isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-2xl bg-[#ede9fe]" />
              ))}
            </div>
          ) : allTasks.length ? (
            <motion.div className="space-y-2">
              {allTasks.slice(0, 5).map((t) => (
                <Card key={t.id} className="glass rounded-2xl">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="size-4 rounded-md border-2 border-[#ede9fe]" />
                    <span className="flex-1 truncate text-sm">{t.title}</span>
                    <Badge variant={priorityVariant[t.priority] ?? "default"}>{t.priority}</Badge>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <Card className="overflow-hidden rounded-2xl">
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

      {upcoming.length > 0 && (
        <section className="mt-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <CalendarClock className="size-5 text-[#7c3aed] dark:text-[#a78bfa]" /> Yaqinlashayotgan muddatlar
            </h2>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/tasks">Barchasi <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((t) => {
              const overdue = isOverdue(t.dueAt);
              return (
                <Card key={t.id} className="glass rounded-2xl">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t.title}</p>
                      <p className={"text-xs " + (overdue ? "text-[#ef4444]" : "text-[#9ca3af] dark:text-[#7c86b0]")}>{dueLabel(t.dueAt)}</p>
                    </div>
                    <Badge variant={priorityVariant[t.priority] ?? "default"}>{t.priority}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
