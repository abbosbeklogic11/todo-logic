import Link from "next/link";
import { CheckSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <CheckSquare className="size-4" />
          </span>
          <span className="body-sm text-text-secondary">
            © {new Date().getFullYear()} Todo Logic
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/login"
            className="body-sm text-text-secondary hover:text-text-primary"
          >
            Kirish
          </Link>
          <Link
            href="/register"
            className="body-sm text-text-secondary hover:text-text-primary"
          >
            Ro'yxatdan o'tish
          </Link>
        </nav>
      </div>
    </footer>
  );
}
