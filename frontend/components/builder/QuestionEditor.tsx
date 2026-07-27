"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
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
  const typeLabel = QUESTION_TYPES.find((t) => t.value === question.type)?.label ?? question.type;

  return (
    <div className="animate-fade-in mx-auto flex max-w-3xl flex-col gap-8 p-6 sm:p-10">
      <div>
        <span className="mb-3 inline-flex items-center rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-accent)]">
          {typeLabel}
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== question.title && saveField({ title: title.trim() })}
          placeholder="Type your question here"
          className="w-full border-b-2 border-[var(--color-border)] bg-transparent py-2 text-2xl font-semibold tracking-tight outline-none transition-colors focus:border-[var(--color-accent)] sm:text-3xl"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (question.description ?? "") && saveField({ description })}
          rows={1}
          placeholder="Add a description (optional)"
          className="mt-2 w-full resize-none bg-transparent text-sm text-[var(--color-text-muted)] outline-none placeholder:text-[var(--color-text-faint)]"
        />
      </div>

      <Card className="flex flex-wrap items-center gap-6 p-5">
        <div className="min-w-[180px] flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Question type
          </label>
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

        <div className="h-9 w-px bg-[var(--color-border)]" />

        <Switch
          checked={question.required}
          onChange={(checked) => saveField({ required: checked })}
          label="Required"
        />
      </Card>

      {isOptionBased && (
        <Card className="p-5">
          <OptionsEditor
            questionId={question.id}
            options={question.options}
            onOptionsChange={handleOptionsChange}
          />
        </Card>
      )}
    </div>
  );
}
