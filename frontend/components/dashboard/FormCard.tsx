"use client";

import Link from "next/link";
import { BarChart3, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import type { FormListItem } from "@/lib/types";

interface FormCardProps {
  form: FormListItem;
  onDelete: (formId: number) => void;
}

export function FormCard({ form, onDelete }: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card hoverable className="group relative flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            form.status === "published"
              ? "bg-green-50 text-green-700"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {form.status === "published" ? "Published" : "Draft"}
        </span>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical className="size-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white shadow-lg">
              <button
                onClick={() => onDelete(form.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="size-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href={`/builder/${form.id}`} className="flex-1">
        <h3 className="line-clamp-2 text-base font-semibold text-[var(--color-text)]">
          {form.title || "Untitled Form"}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Updated {new Date(form.updated_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </Link>

      <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-3">
        <Link
          href={`/builder/${form.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium text-[var(--color-text)] hover:bg-neutral-100"
        >
          <Pencil className="size-3.5" /> Edit
        </Link>
        <Link
          href={`/forms/${form.id}/responses`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium text-[var(--color-text)] hover:bg-neutral-100"
        >
          <BarChart3 className="size-3.5" /> Responses
        </Link>
      </div>
    </Card>
  );
}
