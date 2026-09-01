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
      {/* Desktop Sidebar — 1-rasm uslubida: qorong'i teal, yumaloq, oltin aksent */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-[280px] lg:flex-col lg:p-4">
        <div className="flex h-full flex-col rounded-[24px] bg-[#1e3a3e] p-5 text-white shadow-xl">
          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-white/15 text-sm font-bold ring-2 ring-white/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="truncate text-xs text-white/60">{userEmail}</p>
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
                      ? "bg-white text-[#1e3a3e] shadow"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="size-[18px]" />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Active users / Map illustration — 1-rasm pastki qismi */}
          <div className="mt-4 rounded-2xl bg-white/5 p-4">
            <p className="text-xs font-medium text-white/60">ACTIVE USERS</p>
            <div className="mt-2 flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-7 rounded-full border-2 border-[#1e3a3e] bg-white/20"
                />
              ))}
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#1e3a3e] bg-[#c9a86a] text-xs font-bold text-[#1e3a3e]">
                +7
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-white/40">
              <Globe className="size-4" />
              <span className="text-xs">Global • 24 online</span>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <Select
              value={lang}
              onChange={(e) => setLang(e.target.value as (typeof LANGS)[number])}
              aria-label={t("settings.language")}
              className="h-8 flex-1 border-white/20 bg-white/10 text-xs text-white"
            >
              {LANGS.map((l) => (
                <option key={l} value={l} className="text-black">
                  {t(`lang.${l}`)}
                </option>
              ))}
            </Select>
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              aria-label={t("common.signOut")}
            >
              <LogOut className="size-4" />
            </button>
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

      {/* Mobile top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
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

      {/* Mobile Bottom Dock — 9-rasm floating/dock uslubida */}
      <nav className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-around rounded-[28px] border border-white/20 bg-white px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-medium transition-all",
                active
                  ? "bg-[#1e3a3e] text-white shadow"
                  : "text-text-muted hover:text-text",
              )}
            >
              <Icon className="size-5" />
              <span className="hidden xs:block">{t(item.key).split(" ")[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          aria-label="Chiqish"
        >
          <LogOut className="size-5" />
        </button>
      </nav>

      {/* Spacer for bottom dock on mobile */}
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
