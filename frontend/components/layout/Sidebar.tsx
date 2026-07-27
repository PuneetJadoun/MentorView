import { ReactNode } from "react";

interface SidebarProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function Sidebar({ header, footer, children }: SidebarProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      {header && <div className="border-b border-[var(--color-border)] p-4">{header}</div>}
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
      {footer && <div className="border-t border-[var(--color-border)] p-3">{footer}</div>}
    </aside>
  );
}
