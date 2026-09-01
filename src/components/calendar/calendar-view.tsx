"use client";

import { useMemo, useState } from "react";
import { trpc, type TaskItem } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Bell,
  Clock,
  Users,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";

const HOURS = ["09 AM", "10 AM", "11 AM", "12 PM", "01 PM"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const EVENT_COLORS = [
  "bg-[#ccfbf1] border-[#99f6e4] text-[#115e59]",
  "bg-[#fce7f3] border-[#fbcfe8] text-[#831843]",
  "bg-[#ffedd5] border-[#fed7aa] text-[#7c2d12]",
  "bg-[#ede9fe] border-[#ddd6fe] text-[#4c1d95]",
  "bg-[#fef3c7] border-[#fde68a] text-[#78350f]",
  "bg-[#dbeafe] border-[#bfdbfe] text-[#1e3a8a]",
];

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + 1;
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(d.getDate() + n);
  return r;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function CalendarView() {
  const [selected, setSelected] = useState<Date>(new Date(2025, 5, 18));
  const [view, setView] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const weekStart = useMemo(() => startOfWeek(selected), [selected]);
  const days = useMemo(() => Array.from({ length: 4 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const { data } = trpc.task.list.useQuery({ limit: 100 });
  const tasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data?.tasks ?? [];
    if (!q) return list;
    return list.filter((t) => t.title.toLowerCase().includes(q));
  }, [data, query]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    days.forEach((d) => map.set(d.toDateString(), []));
    tasks.forEach((t) => {
      if (!t.dueAt) {
        const key = days[0]?.toDateString();
        if (key) map.get(key)?.push(t);
        return;
      }
      const due = new Date(t.dueAt);
      for (const d of days) if (isSameDay(due, d)) map.get(d.toDateString())?.push(t);
    });
    return map;
  }, [tasks, days]);

  const miniYear = selected.getFullYear();
  const miniMonth = selected.getMonth();
  const firstDay = new Date(miniYear, miniMonth, 1).getDay();
  const daysInMonth = new Date(miniYear, miniMonth + 1, 0).getDate();
  const miniCells: (number | null)[] = Array(firstDay === 0 ? 6 : firstDay - 1)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))
    .concat(Array(42 - (firstDay === 0 ? 6 : firstDay - 1) - daysInMonth).fill(null).slice(0, 42 - ((firstDay === 0 ? 6 : firstDay - 1) + daysInMonth)));

  const nextEvent = tasks.find((t) => t.dueAt) ?? tasks[0];

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-white p-4 shadow-[0_24px_64px_rgba(124,58,237,0.12)] ring-8 ring-white dark:bg-[#1e1b2e] dark:ring-[#2d2a4a] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <aside className="w-full shrink-0 space-y-4 lg:w-[280px]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a task..." className="h-9 rounded-full bg-[#f5f3ff] pl-9 text-sm dark:bg-[#252545]" />
              </div>
              <Button size="icon" variant="ghost" className="size-9 rounded-full bg-[#f5f3ff] dark:bg-[#252545]">
                <Bell className="size-4" />
              </Button>
            </div>

            <Card className="rounded-2xl border-0 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:bg-[#252545]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {selected.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="size-7" onClick={() => setSelected(addDays(selected, -30))}>
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-7" onClick={() => setSelected(addDays(selected, 30))}>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={`${d}-${i}`} className="py-1 font-medium text-[#9ca3af]">
                      {d}
                    </span>
                  ))}
                  {miniCells.slice(0, 35).map((n, i) => {
                    const isSelected = n !== null && isSameDay(new Date(miniYear, miniMonth, n), selected);
                    const isToday = n !== null && isSameDay(new Date(miniYear, miniMonth, n), new Date());
                    return (
                      <button
                        key={i}
                        disabled={n === null}
                        onClick={() => n !== null && setSelected(new Date(miniYear, miniMonth, n))}
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-xs",
                          n === null && "invisible",
                          isSelected && "bg-[#facc15] font-bold text-black",
                          !isSelected && isToday && "bg-[#ede9fe] text-[#7c3aed]",
                          !isSelected && !isToday && "hover:bg-[#f5f3ff] dark:hover:bg-[#2d2a4a]",
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {nextEvent && (
              <Card className="rounded-2xl border-0 bg-[#0f766e] p-4 text-white shadow">
                <p className="text-xs font-medium text-white/70">Meeting reminder</p>
                <p className="mt-1 text-sm font-semibold">{nextEvent.title.slice(0, 28)}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                  <Clock className="size-3" /> 09:00 - 09:30
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((k) => (
                      <div key={k} className="size-6 rounded-full border-2 border-[#0f766e] bg-white/20" />
                    ))}
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-[#0f766e] bg-white text-xs font-bold text-[#0f766e]">
                      +2
                    </span>
                  </div>
                  <Button size="sm" className="ml-auto h-7 rounded-full bg-[#facc15] px-3 text-xs font-bold text-black hover:bg-[#facc15]/90">
                    Join
                  </Button>
                </div>
              </Card>
            )}

            <Card className="rounded-2xl border-0 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:bg-[#252545]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Filters</h4>
                  <Filter className="size-4 text-[#9ca3af]" />
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  {[
                    { label: "Meetings", checked: true },
                    { label: "Task Due Dates", checked: false },
                    { label: "Milestones", checked: false },
                    { label: "Deadlines", checked: false },
                    { label: "Personal Events", checked: false },
                    { label: "Birthdays", checked: false },
                  ].map((f) => (
                    <label key={f.label} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={f.checked} className="size-3.5 rounded border-[#ede9fe] text-[#7c3aed]" />
                      <span className={cn("text-xs", f.checked ? "font-medium" : "text-[#6b7280]")}>{f.label}</span>
                    </label>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between rounded-xl bg-[#f5f3ff] dark:bg-[#2d2a4a]">
                  <span className="flex items-center gap-2 text-xs">
                    <CalendarIcon className="size-4" /> Other Calendars
                  </span>
                  <ChevronRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setSelected(addDays(selected, -7))}>
                  <ChevronLeft className="size-4" />
                </Button>
                <h2 className="text-sm font-semibold sm:text-base">
                  {selected.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h2>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setSelected(addDays(selected, 7))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-full bg-[#f5f3ff] p-1 dark:bg-[#252545]">
                  {(["Daily", "Weekly", "Monthly"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setView(m)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        view === m ? "bg-white shadow dark:bg-[#1e1b2e] dark:text-white" : "text-[#6b7280]",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <Button size="sm" className="rounded-full bg-[#facc15] text-black hover:bg-[#facc15]/90" onClick={() => setDialogOpen(true)}>
                  <Plus className="size-4" /> Create Event
                </Button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#ede9fe] bg-white dark:border-[#2d2a4a] dark:bg-[#252545]">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-px bg-[#ede9fe] dark:bg-[#2d2a4a]">
                  <div className="bg-[#f9f8ff] p-2 text-xs font-medium text-[#9ca3af] dark:bg-[#1e1b2e]">GMT+07</div>
                  {days.map((d) => (
                    <div key={d.toDateString()} className="bg-white p-2 text-center dark:bg-[#252545]">
                      <p className="text-xs text-[#9ca3af]">{d.toLocaleDateString("en-US", { weekday: "long" })}</p>
                      <p className="text-lg font-bold">{d.getDate()}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-px bg-[#ede9fe] dark:bg-[#2d2a4a]">
                  <div className="flex flex-col bg-white dark:bg-[#252545]">
                    {HOURS.map((h) => (
                      <div key={h} className="h-[88px] border-t border-[#f5f3ff] p-2 text-xs text-[#9ca3af] dark:border-[#2d2a4a] dark:text-[#7c86b0]">
                        {h}
                      </div>
                    ))}
                  </div>
                  {days.map((day) => {
                    const list = tasksByDay.get(day.toDateString()) ?? [];
                    return (
                      <div key={day.toDateString()} className="relative bg-white dark:bg-[#252545]">
                        {HOURS.map((_, i) => (
                          <div key={i} className="h-[88px] border-t border-[#f5f3ff] dark:border-[#2d2a4a]" />
                        ))}
                        <div className="absolute inset-0 p-1">
                          {list.slice(0, 3).map((t, idx) => {
                            const top = 8 + idx * 88;
                            const color = EVENT_COLORS[idx % EVENT_COLORS.length];
                            const due = t.dueAt ? new Date(t.dueAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "09:00 - 09:30";
                            return (
                              <div
                                key={t.id}
                                className={cn("absolute left-1 right-1 rounded-xl border p-2 shadow-sm", color)}
                                style={{ top }}
                              >
                                <p className="truncate text-xs font-semibold leading-tight">{t.title}</p>
                                <p className="mt-1 flex items-center gap-1 text-[11px] opacity-80">
                                  <Clock className="size-3" /> {due}
                                </p>
                                <div className="mt-1.5 flex -space-x-1">
                                  {[1, 2].map((k) => (
                                    <div key={k} className="size-5 rounded-full border border-white bg-white/40" />
                                  ))}
                                  <span className="flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-bold">+2</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-[#9ca3af] dark:text-[#7c86b0]">Rasmdagi kabi haftalik ko&apos;rinish — vazifalar muddatiga qarab joylashadi</p>
          </div>
        </div>
      </div>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={null} />
    </div>
  );
}
