"use client";

import { X } from "lucide-react";
import { FormRunner } from "@/components/public-form/FormRunner";
import type { Question } from "@/lib/types";

interface PreviewOverlayProps {
  formTitle: string;
  formDescription?: string | null;
  questions: Question[];
  onClose: () => void;
}

export function PreviewOverlay({ formTitle, formDescription, questions, onClose }: PreviewOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 animate-fade-in bg-[var(--color-bg)]">
      <button
        onClick={onClose}
        className="fixed right-5 top-5 z-50 flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3.5 py-2 text-sm font-medium shadow-md hover:bg-neutral-50 cursor-pointer"
      >
        <X className="size-4" /> Exit preview
      </button>
      <div className="fixed left-5 top-5 z-50 rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white">
        Preview mode
      </div>
      <FormRunner
        formTitle={formTitle}
        formDescription={formDescription}
        questions={questions}
        previewMode
        onSubmit={() => {
          // Preview never calls the API — FormRunner shows the "preview" thank-you copy.
        }}
      />
    </div>
  );
}
