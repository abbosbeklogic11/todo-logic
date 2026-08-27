import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border surface-glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <CheckSquare className="size-5" />
          </span>
          <span className="text-lg tracking-tight">Todo Logic</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="body-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Xususiyatlar
          </a>
          <a
            href="#how"
            className="body-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Qanday ishlaydi
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Kirish</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Boshlash</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
