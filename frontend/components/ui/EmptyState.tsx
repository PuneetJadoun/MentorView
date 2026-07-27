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
    <div className="animate-fade-in flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)]/40 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-[var(--color-border)]">
        <Icon className="size-6 text-[var(--color-text-muted)]" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
        {description && (
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
