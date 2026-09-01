"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  Target,
  Flame,
  Settings,
  LogOut,
  Plus,
  Globe,
  CalendarDays,
} from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { LANGS } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const NAV = [
  { href: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", key: "nav.tasks", icon: ListTodo, label: "Vazifalar" },
  { href: "/goals", key: "nav.goals", icon: Target, label: "Maqsadlar" },
  { href: "/habits", key: "nav.habits", icon: Flame, label: "Odatlar" },
  { href: "/calendar", key: "nav.calendar", icon: CalendarDays, label: "Kalendar" },
  { href: "/settings", key: "nav.settings", icon: Settings, label: "Sozlamalar" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "User";
  const userEmail = session?.user?.email ?? "";
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Desktop Sidebar — Minimal Glassmorphism */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-[280px] lg:flex-col lg:p-4">
        <div className="glass-strong flex h-full flex-col rounded-[24px] p-5">
          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{userName}</p>
              <p className="truncate text-xs text-text-muted">{userEmail}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex flex-1 flex-col gap-1.5">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                  )}
                >
                  <Icon className="size-[18px]" />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Active users */}
          <div className="mt-4 rounded-2xl bg-surface-hover p-4">
            <p className="text-xs font-medium text-text-secondary">ACTIVE USERS</p>
            <div className="mt-2 flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-7 rounded-full border-2 border-border bg-surface" />
              ))}
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-surface bg-primary text-xs font-bold text-primary-foreground">
                +7
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-text-muted">
              <Globe className="size-4" />
              <span className="text-xs">Global • 24 online</span>
            </div>
          </div>

          {/* Bottom controls — Chiqish endi Sozlamalarda */}
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <Select
              value={lang}
              onChange={(e) => setLang(e.target.value as (typeof LANGS)[number])}
              aria-label={t("settings.language")}
              className="h-8 flex-1 border-border bg-surface-hover text-xs text-text-primary"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {t(`lang.${l}`)}
                </option>
              ))}
            </Select>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Tablet top bar (md-lg) — minimal */}
      <header className="hidden border-b border-border bg-surface/80 backdrop-blur md:flex lg:hidden">
        <div className="flex h-14 w-full items-center gap-4 px-4 sm:px-6">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <LayoutDashboard className="size-4" />
          </span>
          <span className="font-semibold">Todo Logic</span>
          <nav className="ml-6 flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium",
                    active ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Select
              value={lang}
              onChange={(e) => setLang(e.target.value as (typeof LANGS)[number])}
              className="h-9 w-20"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {t(`lang.${l}`)}
                </option>
              ))}
            </Select>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile top bar — safe-area bilan */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 pt-[env(safe-area-inset-top)] md:hidden" style={{ height: "calc(56px + env(safe-area-inset-top))" }}>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <LayoutDashboard className="size-4" />
          </span>
          <span className="font-semibold">Todo Logic</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value as (typeof LANGS)[number])}
            className="h-8 w-16 text-xs"
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {t(`lang.${l}`)}
              </option>
            ))}
          </Select>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Bottom Dock — Mukammal markazlash, barcha telefonlarda */}
      <nav
        className="glass fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-24px)] max-w-[380px] -translate-x-1/2 items-center justify-around gap-1 rounded-[28px] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:hidden"
        style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      >
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium leading-none transition-all",
                active ? "bg-primary text-primary-foreground shadow" : "text-text-muted hover:text-text-primary",
              )}
            >
              <Icon className="size-[20px]" />
              <span className="truncate text-[9px]">{t(item.key).split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer for bottom dock on mobile — safe-area bilan */}
      <div className="h-[calc(80px+env(safe-area-inset-bottom))] md:hidden" aria-hidden />
    </>
  );
}
