import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100">
        <Icon className="size-6 text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
