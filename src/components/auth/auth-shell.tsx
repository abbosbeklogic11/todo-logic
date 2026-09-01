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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] p-4">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 lg:flex-row">
        <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#a78bfa] p-6 sm:p-8 lg:min-h-[600px] lg:w-[45%] lg:p-10">
          <img
            src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80&auto=format&fit=crop"
            alt="Astronaut"
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Link href="/" className="relative flex items-center gap-2 font-semibold text-white">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <CheckSquare className="size-5 text-white" />
            </span>
            <span className="text-lg tracking-tight">Todo Logic</span>
          </Link>
          <div className="relative">
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[28px]">
              Exploring new frontiers, one step at a time.
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Maqsadlaringizni mantiqli boshqaring — vazifalar, odatlar va fokus bir joyda.
            </p>
            <div className="mt-6 hidden items-center gap-2 lg:flex">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="size-8 rounded-full border-2 border-white/20 bg-white/20" />
                ))}
              </div>
              <span className="text-xs text-white/70">10k+ faol foydalanuvchi</span>
            </div>
          </div>
          <p className="relative hidden text-xs text-white/50 lg:block">Beyond Earth&apos;s glove — premium productivity.</p>
        </div>

        <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className={cn("w-full", className)}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
            </div>
            {children}
          </div>
          {footer && (
            <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
