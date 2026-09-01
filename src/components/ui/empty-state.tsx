import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  image,
  imageAlt,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-4 py-10 text-center sm:px-6 sm:py-14",
        className,
      )}
    >
      {image ? (
        <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-border sm:max-w-[360px]">
          <img
            src={image}
            alt={imageAlt ?? title}
            className="h-36 w-full object-cover sm:h-40"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {icon && (
            <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl bg-white/95 text-primary shadow backdrop-blur dark:bg-zinc-900/90 [&_svg]:size-5">
              {icon}
            </span>
          )}
        </div>
      ) : (
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 sm:size-24">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-gradient/10 text-primary sm:size-20 [&_svg]:size-10 sm:[&_svg]:size-12">
            {icon}
          </div>
        </div>
      )}
      <div className="flex max-w-sm flex-col gap-1.5 px-2">
        <h3 className="text-base font-semibold text-text-primary sm:text-lg">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
