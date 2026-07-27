"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SidebarProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ header, footer, children, isMobileOpen, onMobileClose }: SidebarProps) {
  const content = (
    <>
      {header && <div className="border-b border-[var(--color-border)] p-4">{header}</div>}
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
      {footer && <div className="border-t border-[var(--color-border)] p-3">{footer}</div>}
    </>
  );

  return (
    <>
      {/* Desktop: static column */}
      <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex">
        {content}
      </aside>

      {/* Mobile/tablet: slide-over drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--color-surface)] shadow-[var(--shadow-popover)] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
