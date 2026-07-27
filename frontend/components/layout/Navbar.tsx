import Link from "next/link";
import { ReactNode } from "react";

interface NavbarProps {
  left?: ReactNode;
  right?: ReactNode;
}

export function Navbar({ left, right }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-6 backdrop-blur">
      <div className="flex items-center gap-4 min-w-0">
        {left ?? (
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Typeform<span className="text-[var(--color-accent)]">Clone</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3">{right}</div>
    </header>
  );
}
