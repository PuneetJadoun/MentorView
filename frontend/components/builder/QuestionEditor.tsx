"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OptionsEditor } from "@/components/builder/OptionsEditor";
import { questionsApi, getApiErrorMessage } from "@/lib/api";
import { OPTION_BASED_TYPES, QUESTION_TYPES } from "@/lib/types";
import type { Question, QuestionOption, QuestionType } from "@/lib/types";

interface QuestionEditorProps {
  question: Question;
  onChange: (updated: Question) => void;
}

// The parent renders this with key={question.id}, so switching questions
// remounts the component and these useState initializers naturally re-run
// with the new question's values — no effect needed to "reset" them.
export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description ?? "");

  const saveField = async (patch: Partial<{ title: string; description: string; type: QuestionType; required: boolean }>) => {
    try {
      const updated = await questionsApi.update(question.id, patch);
      onChange(updated);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleOptionsChange = (options: QuestionOption[]) => {
    onChange({ ...question, options });
  };

  const isOptionBased = OPTION_BASED_TYPES.includes(question.type);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Question
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== question.title && saveField({ title: title.trim() })}
          placeholder="Type your question"
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-base outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Description <span className="text-[var(--color-text-muted)]">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (question.description ?? "") && saveField({ description })}
          rows={2}
          placeholder="Add helper text for respondents"
          className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Type</label>
          <select
            value={question.type}
            onChange={(e) => saveField({ type: e.target.value as QuestionType })}
            className="w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-2 self-end pb-2.5 text-sm font-medium">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => saveField({ required: e.target.checked })}
            className="size-4 cursor-pointer accent-[var(--color-accent)]"
          />
          Required
        </label>
      </div>

      {isOptionBased && (
        <OptionsEditor
          questionId={question.id}
          options={question.options}
          onOptionsChange={handleOptionsChange}
        />
      )}
    </div>
  );
}
