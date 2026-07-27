"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatIST } from "@/lib/date";
import type { FormListItem } from "@/lib/types";

interface FormCardProps {
  form: FormListItem;
  onDelete: (formId: number) => void;
}

export function FormCard({ form, onDelete }: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPublished = form.status === "published";

  return (
    <Card hoverable className="group relative flex flex-col gap-4 overflow-hidden p-5">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          isPublished ? "bg-[var(--color-success)]" : "bg-[var(--color-border-strong)]"
        }`}
      />

      <div className="flex items-start justify-between gap-2">
        <Badge tone={isPublished ? "success" : "neutral"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            className="rounded-full p-1.5 text-[var(--color-text-faint)] opacity-0 transition-opacity hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)] focus:opacity-100 group-hover:opacity-100 cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical className="size-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-popover)]"
              >
                <button
                  onClick={() => onDelete(form.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] cursor-pointer"
                >
                  <Trash2 className="size-4" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Link href={`/builder/${form.id}`} className="flex-1">
        <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-[var(--color-text)]">
          {form.title || "Untitled Form"}
        </h3>
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          Updated{" "}
          {formatIST(form.updated_at, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </Link>

      <div className="flex items-center gap-1 border-t border-[var(--color-border)] pt-3">
        <Link
          href={`/builder/${form.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)]"
        >
          <Pencil className="size-3.5" /> Edit
        </Link>
        <Link
          href={`/forms/${form.id}/responses`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)]"
        >
          <BarChart3 className="size-3.5" /> Responses
        </Link>
      </div>
    </Card>
  );
}

export function FormCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton size-7 rounded-full" />
      </div>
      <div>
        <div className="skeleton h-4 w-3/4 rounded-md" />
        <div className="skeleton mt-2 h-3 w-1/3 rounded-md" />
      </div>
      <div className="flex gap-2 border-t border-[var(--color-border)] pt-3">
        <div className="skeleton h-8 flex-1 rounded-full" />
        <div className="skeleton h-8 flex-1 rounded-full" />
      </div>
    </Card>
  );
}
