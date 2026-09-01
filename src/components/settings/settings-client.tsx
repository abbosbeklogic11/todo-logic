"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { trpc } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import { LANGS } from "@/lib/i18n/translations";
import { taskPrioritySchema, type TaskPriority } from "@/lib/schemas/task";
import { PRIORITY_LABELS } from "@/lib/task-utils";

const THEMES = ["system", "light", "dark"] as const;

export function SettingsClient() {
  const { t, lang, setLang } = useLanguage();
  const { setTheme } = useTheme();
  const settings = trpc.settings.get.useQuery();

  const [language, setLanguage] = useState<(typeof LANGS)[number]>(lang);
  const [theme, setThemeState] = useState<(typeof THEMES)[number]>("system");
  const [defaultPriority, setDefaultPriority] =
    useState<TaskPriority>("MEDIUM");
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    if (!settings.data) return;
    setThemeState(
      (settings.data.theme as (typeof THEMES)[number]) ?? "system",
    );
    setDefaultPriority(
      (settings.data.defaultTaskPriority as TaskPriority) ?? "MEDIUM",
    );
    setEmailNotifications(settings.data.emailNotifications ?? false);
    setLanguage(lang);
  }, [settings.data, lang]);

  const update = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success(t("settings.saved"));
    },
    onError: (e) => toast.error(e.message),
  });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (language !== lang) setLang(language);
    setTheme(theme);
    update.mutate({
      theme,
      defaultTaskPriority: defaultPriority,
      emailNotifications,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-sm text-text-muted">{t("settings.subtitle")}</p>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.profile")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("settings.name")}</Label>
              <Input id="name" value={settings.data?.fullName ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("settings.email")}</Label>
              <Input id="email" value={settings.data?.email ?? ""} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="language">{t("settings.language")}</Label>
              <Select
                id="language"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as (typeof LANGS)[number])
                }
              >
                {LANGS.map((l) => (
                  <option key={l} value={l}>
                    {t(`lang.${l}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="theme">{t("settings.theme")}</Label>
              <Select
                id="theme"
                value={theme}
                onChange={(e) =>
                  setThemeState(e.target.value as (typeof THEMES)[number])
                }
              >
                {THEMES.map((th) => (
                  <option key={th} value={th}>
                    {t(`theme.${th}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority">{t("settings.defaultPriority")}</Label>
              <Select
                id="priority"
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value as TaskPriority)}
              >
                {taskPrioritySchema.options.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="email-notif">{t("settings.emailNotifications")}</Label>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={update.isPending}>
            {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("common.save")}
          </Button>
        </div>
      </form>

      <Card className="border-error/20">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{t("common.signOut")}</p>
            <p className="text-sm text-text-muted">Barcha qurilmalarda hisobdan chiqish</p>
          </div>
          <Button variant="danger" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="size-4" /> {t("common.signOut")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
