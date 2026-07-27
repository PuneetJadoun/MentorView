"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionField } from "@/components/public-form/QuestionField";
import type { QuestionType } from "@/lib/types";

interface RunnerOption {
  id: number;
  option_text: string;
}

export interface RunnerQuestion {
  id: number;
  title: string;
  description: string | null;
  type: QuestionType;
  required: boolean;
  options: RunnerOption[];
}

interface FormRunnerProps {
  formTitle: string;
  formDescription?: string | null;
  questions: RunnerQuestion[];
  onSubmit: (answers: { question_id: number; answer: string }[]) => Promise<void> | void;
  previewMode?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTO_ADVANCE_TYPES: QuestionType[] = ["yes_no", "multiple_choice", "dropdown"];

export function FormRunner({
  formTitle,
  formDescription,
  questions,
  onSubmit,
  previewMode = false,
}: FormRunnerProps) {
  const [step, setStep] = useState(-1); // -1 = intro screen
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [prevStep, setPrevStep] = useState(step);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const total = questions.length;
  const current = step >= 0 && step < total ? questions[step] : null;
  const progress = step < 0 ? 0 : ((step + 1) / total) * 100;

  // Clear the validation error as soon as the step changes, during render
  // rather than in an effect (React's recommended pattern for resetting
  // state in response to a prop/state change — see "Adjusting state when a
  // prop changes" in the React docs).
  if (step !== prevStep) {
    setPrevStep(step);
    setError(null);
  }

  // Focusing the new question's input is a genuine effect (it touches the
  // DOM after commit), so it stays in useEffect — it just no longer also
  // resets state.
  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const validateCurrent = (): boolean => {
    if (!current) return true;
    const value = (answers[current.id] ?? "").trim();
    if (current.required && !value) {
      setError("This question requires an answer.");
      return false;
    }
    if (value && current.type === "email" && !EMAIL_REGEX.test(value)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (value && current.type === "number" && Number.isNaN(Number(value))) {
      setError("Please enter a valid number.");
      return false;
    }
    return true;
  };

  const goNext = async () => {
    if (step === -1) {
      setStep(0);
      return;
    }
    if (!validateCurrent()) return;

    if (step === total - 1) {
      setSubmitting(true);
      try {
        const payload = questions
          .filter((q) => (answers[q.id] ?? "").trim().length > 0)
          .map((q) => ({ question_id: q.id, answer: answers[q.id] }));
        await onSubmit(payload);
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const setAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError(null);
    if (current && AUTO_ADVANCE_TYPES.includes(current.type)) {
      setAutoAdvance(true);
    }
  };

  // Auto-advance shortly after picking a single-select answer, Typeform-style.
  useEffect(() => {
    if (!autoAdvance) return;
    const timer = setTimeout(() => {
      setAutoAdvance(false);
      goNext();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvance]);

  // Keyboard navigation: Enter/ArrowDown to advance, ArrowUp for previous.
  // Skip when focus is in a <textarea> so multi-line typing isn't hijacked.
  useEffect(() => {
    if (submitted) return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" && e.key !== "ArrowUp") return;
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp" && step > 0) {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, answers, submitted]);

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-6 text-center animate-fade-in">
        <CheckCircle2 className="size-12 text-[var(--color-accent)]" />
        <h1 className="text-2xl font-semibold">Thank you!</h1>
        <p className="max-w-sm text-[var(--color-text-muted)]">
          {previewMode
            ? "This is a preview — no response was actually recorded."
            : "Your response has been recorded."}
        </p>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-bg)] px-6 text-center animate-fade-in">
        <div className="max-w-lg">
          <h1 className="text-3xl font-semibold tracking-tight">{formTitle}</h1>
          {formDescription && (
            <p className="mt-3 text-[var(--color-text-muted)]">{formDescription}</p>
          )}
        </div>
        <Button size="lg" onClick={goNext} disabled={total === 0}>
          {total === 0 ? "This form has no questions" : "Start"}{" "}
          {total > 0 && <ArrowRight className="size-4" />}
        </Button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <div className="px-6 pt-6">
        <ProgressBar value={progress} />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div key={current.id} className="w-full max-w-xl animate-fade-in">
          <p className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">
            Question {step + 1} of {total}
            {current.required && <span className="text-[var(--color-danger)]"> *</span>}
          </p>
          <h2 className="text-2xl font-semibold leading-snug">{current.title}</h2>
          {current.description && (
            <p className="mt-2 text-[var(--color-text-muted)]">{current.description}</p>
          )}

          <div className="mt-6">
            <QuestionField
              question={current}
              value={answers[current.id] ?? ""}
              onChange={(v) => setAnswer(current.id, v)}
              inputRef={inputRef}
            />
          </div>

          {error && <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}

          <div className="mt-8 flex items-center gap-3">
            <Button onClick={goNext} isLoading={submitting}>
              {step === total - 1 ? "Submit" : "OK"} <ArrowRight className="size-4" />
            </Button>
            {step > 0 && (
              <Button variant="ghost" onClick={goPrev}>
                <ArrowLeft className="size-4" /> Previous
              </Button>
            )}
            <span className="hidden text-xs text-[var(--color-text-muted)] sm:inline">
              press Enter ↵
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
