import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
          <CheckSquare className="size-5" />
        </span>
        <span className="text-lg tracking-tight">Todo Logic</span>
      </Link>
      <div
        className={cn(
          "w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-md sm:p-8",
          className,
        )}
      >
        <div className="mb-6 text-center">
          <h1 className="h3">{title}</h1>
          {subtitle && (
            <p className="body-sm mt-1 text-text-secondary">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      {footer && (
        <div className="mt-6 text-center body-sm text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
}
