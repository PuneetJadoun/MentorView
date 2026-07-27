"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FormRunner } from "@/components/public-form/FormRunner";
import type { FormDetail, Question } from "@/lib/types";

interface PreviewOverlayProps {
  form: FormDetail;
  questions: Question[];
  onClose: () => void;
}

export function PreviewOverlay({ form, questions, onClose }: PreviewOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-[var(--color-bg)]"
    >
      <button
        onClick={onClose}
        className="fixed right-5 top-5 z-50 flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm font-medium shadow-[var(--shadow-popover)] transition-colors hover:bg-[var(--color-surface-hover)] cursor-pointer"
      >
        <X className="size-4" /> Exit preview
      </button>
      {/* Intentionally theme-independent: a floating overlay chip, not page content */}
      <div className="fixed left-5 top-5 z-50 rounded-full bg-black/85 px-3 py-1.5 text-xs font-medium text-white">
        Preview mode
      </div>
      <FormRunner
        formTitle={form.title}
        formDescription={form.description}
        questions={questions}
        accentColor={form.theme_color}
        backgroundColor={form.background_color}
        fontFamily={form.font_family}
        darkMode={form.dark_mode}
        thankYouTitle={form.thank_you_title}
        thankYouSubtitle={form.thank_you_subtitle}
        previewMode
        onSubmit={() => {
          // Preview never calls the API — FormRunner shows the "preview" thank-you copy.
        }}
      />
    </motion.div>
  );
}
