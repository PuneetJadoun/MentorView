"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { questionsApi, getApiErrorMessage } from "@/lib/api";
import type { QuestionOption } from "@/lib/types";

interface OptionsEditorProps {
  questionId: number;
  options: QuestionOption[];
  onOptionsChange: (options: QuestionOption[]) => void;
}

export function OptionsEditor({ questionId, options, onOptionsChange }: OptionsEditorProps) {
  const [newOptionText, setNewOptionText] = useState("");
  const [adding, setAdding] = useState(false);

  const addOption = async () => {
    const text = newOptionText.trim();
    if (!text) return;
    setAdding(true);
    try {
      const created = await questionsApi.createOption(questionId, { option_text: text });
      onOptionsChange([...options, created]);
      setNewOptionText("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setAdding(false);
    }
  };

  const updateOptionText = async (optionId: number, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const updated = await questionsApi.updateOption(optionId, { option_text: trimmed });
      onOptionsChange(options.map((o) => (o.id === optionId ? updated : o)));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const deleteOption = async (optionId: number) => {
    try {
      await questionsApi.deleteOption(optionId);
      onOptionsChange(options.filter((o) => o.id !== optionId));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div>
      <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        Options
      </label>
      <div className="flex flex-col gap-2">
        {options.map((option, i) => (
          <div key={option.id} className="group flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)]">
              {String.fromCharCode(65 + i)}
            </span>
            <input
              defaultValue={option.option_text}
              onBlur={(e) => updateOptionText(option.id, e.target.value)}
              className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <button
              onClick={() => deleteOption(option.id)}
              className="shrink-0 rounded-full p-2 text-[var(--color-text-faint)] opacity-0 transition-opacity hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] group-hover:opacity-100 cursor-pointer"
              aria-label="Delete option"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-dashed border-[var(--color-border-strong)] text-xs font-semibold text-[var(--color-text-faint)]">
          {String.fromCharCode(65 + options.length)}
        </span>
        <input
          value={newOptionText}
          onChange={(e) => setNewOptionText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addOption();
            }
          }}
          placeholder="Add an option..."
          className="flex-1 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
        <button
          onClick={addOption}
          disabled={adding || !newOptionText.trim()}
          className="shrink-0 rounded-full p-2 text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] disabled:opacity-40 cursor-pointer"
          aria-label="Add option"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
