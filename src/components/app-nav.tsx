"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { LANGS } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/tasks", key: "nav.tasks" },
  { href: "/goals", key: "nav.goals" },
  { href: "/habits", key: "nav.habits" },
  { href: "/settings", key: "nav.settings" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <Flame className="size-4" />
          </span>
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:text-text",
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
            aria-label={t("settings.language")}
            className="h-9 w-20"
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {t(`lang.${l}`)}
              </option>
            ))}
          </Select>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:text-text",
              )}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
