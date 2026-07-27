import Link from "next/link";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavbarProps {
  left?: ReactNode;
  right?: ReactNode;
}

export function Navbar({ left, right }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {left ?? (
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Typeform<span className="text-[var(--color-accent)]">Clone</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {right}
        <ThemeToggle />
      </div>
    </header>
  );
}
