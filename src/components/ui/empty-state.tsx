import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Barcha ro'yxatlar uchun majburiy bo'sh holat (spec §3.5 / §3.7).
 * Ikonka 96px o'lchamda, orqasida gradient doira.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex size-24 items-center justify-center rounded-full bg-primary/10">
        <div className="flex size-20 items-center justify-center rounded-full bg-brand-gradient/10 text-primary [&_svg]:size-12">
          {icon}
        </div>
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="h4 text-text-primary">{title}</h3>
        <p className="body-sm text-text-secondary">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
