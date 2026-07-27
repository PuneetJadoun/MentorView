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
      className={`group relative mb-1.5 flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] py-2.5 pl-3 pr-2 transition-colors ${
        isSelected ? "bg-[var(--color-accent-soft)]" : "hover:bg-[var(--color-bg-subtle)]"
      } ${isDragging ? "z-10 opacity-50 shadow-[var(--shadow-popover)]" : ""}`}
    >
      <span
        className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full transition-colors ${
          isSelected ? "bg-[var(--color-accent)]" : "bg-transparent"
        }`}
      />

      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab touch-none text-[var(--color-text-faint)] opacity-0 transition-opacity hover:text-[var(--color-text-muted)] group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold ${
          isSelected
            ? "bg-[var(--color-accent)] text-white"
            : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"
        }`}
      >
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
          }`}
        >
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
        className="shrink-0 rounded-full p-1.5 text-[var(--color-text-faint)] opacity-0 hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] group-hover:opacity-100 cursor-pointer"
        aria-label="Delete question"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
