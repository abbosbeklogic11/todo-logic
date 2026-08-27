"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { PASSWORD_POLICY } from "@/lib/password";
import { cn } from "@/lib/utils";

export function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(() => {
    return [
      { label: "Kamida 8 belgi", valid: password.length >= PASSWORD_POLICY.minLength },
      { label: "1 ta katta harf", valid: /[A-Z]/.test(password) },
      { label: "1 ta raqam", valid: /\d/.test(password) },
      { label: "1 ta maxsus belgi", valid: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const score = checks.filter((c) => c.valid).length;
  const strength = ["Juda zaif", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"][score];
  const color =
    score <= 1
      ? "var(--error)"
      : score === 2
        ? "var(--warning)"
        : score === 3
          ? "var(--info)"
          : "var(--success)";

  if (!password) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i < score ? color : "var(--surface-hover)" }}
          />
        ))}
      </div>
      <p className="caption" style={{ color }}>
        {strength}
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "flex items-center gap-1 text-xs",
              c.valid ? "text-success" : "text-text-muted",
            )}
          >
            <Check className={cn("size-3", !c.valid && "opacity-30")} />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
