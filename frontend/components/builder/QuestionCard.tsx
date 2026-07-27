"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { QUESTION_TYPES } from "@/lib/types";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function QuestionCard({ question, index, isSelected, onSelect, onDelete }: QuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const typeLabel = QUESTION_TYPES.find((t) => t.value === question.type)?.label ?? question.type;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      className={`group mb-2 flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border px-2.5 py-2.5 transition-colors ${
        isSelected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
          : "border-transparent hover:bg-neutral-100"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab touch-none text-neutral-300 hover:text-neutral-500 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      <span className="flex size-5 shrink-0 items-center justify-center rounded bg-neutral-100 text-[10px] font-semibold text-neutral-500">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-text)]">
          {question.title || "Untitled question"}
        </p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">
          {typeLabel}
          {question.required && " · Required"}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 rounded-full p-1.5 text-neutral-300 opacity-0 hover:bg-red-50 hover:text-[var(--color-danger)] group-hover:opacity-100 cursor-pointer"
        aria-label="Delete question"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
