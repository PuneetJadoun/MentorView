"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
  accentColor?: string | null;
  backgroundColor?: string | null;
  fontFamily?: string | null;
  darkMode?: boolean;
  thankYouTitle?: string | null;
  thankYouSubtitle?: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTO_ADVANCE_TYPES: QuestionType[] = ["yes_no", "multiple_choice", "dropdown"];
const EASE = [0.16, 1, 0.3, 1] as const;

// A per-form "dark mode" (chosen by the creator in Theme settings) is scoped
// to just this component via inline CSS custom properties — independent of
// the visitor's own light/dark preference, which only applies to the
// creator-facing app and never renders on this page anyway.
const DARK_PALETTE: Record<string, string> = {
  "--color-bg": "#17181c",
  "--color-bg-subtle": "#1e1f24",
  "--color-surface": "#1e1f24",
  "--color-surface-hover": "#26272d",
  "--color-border": "#2d2e35",
  "--color-border-strong": "#3b3c44",
  "--color-text": "#f2f2f0",
  "--color-text-muted": "#a3a2a8",
  "--color-text-faint": "#6c6c72",
  "--color-accent": "#3b82f6",
  "--color-accent-hover": "#60a5fa",
  "--color-accent-soft": "#1c2b4a",
  "--color-success": "#4ade80",
  "--color-success-soft": "#143221",
  "--color-danger": "#f87171",
  "--color-danger-soft": "#3a1a1a",
};

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? 28 : -28 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -28 : 28 }),
};

export function FormRunner({
  formTitle,
  formDescription,
  questions,
  onSubmit,
  previewMode = false,
  accentColor,
  backgroundColor,
  fontFamily,
  darkMode = false,
  thankYouTitle,
  thankYouSubtitle,
}: FormRunnerProps) {
  const themeStyle = {
    ...(darkMode ? DARK_PALETTE : {}),
    ...(accentColor ? { "--color-accent": accentColor, "--color-accent-hover": accentColor } : {}),
    ...(backgroundColor ? { "--color-bg": backgroundColor } : {}),
    ...(fontFamily ? { fontFamily } : {}),
  } as React.CSSProperties;

  const [step, setStep] = useState(-1); // -1 = intro screen
  const [direction, setDirection] = useState(1);
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
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
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
      setDirection(1);
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
        setDirection(1);
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setError(null);
    setDirection(-1);
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
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvance]);

  // Keyboard navigation: Enter/ArrowDown/ArrowRight advance, ArrowUp/ArrowLeft go back.
  // Skip when focus is in a <textarea> so multi-line typing isn't hijacked.
  useEffect(() => {
    if (submitted) return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" && !["ArrowUp", "ArrowLeft"].includes(e.key)) return;
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && step > 0) {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, answers, submitted]);

  return (
    <div
      style={themeStyle}
      className="bg-dot-grid relative flex min-h-screen flex-col overflow-hidden bg-[var(--color-bg)]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.06), transparent)",
        }}
      />

      {step >= 0 && !submitted && (
        <div className="relative z-10 px-6 pt-6 sm:px-10">
          <ProgressBar value={progress} />
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              className="flex size-16 items-center justify-center rounded-full bg-[var(--color-success-soft)]"
            >
              <CheckCircle2 className="size-9 text-[var(--color-success)]" strokeWidth={1.75} />
            </motion.div>
            <h1 className="text-3xl font-semibold tracking-tight">{thankYouTitle || "Thank you!"}</h1>
            <p className="max-w-sm text-[var(--color-text-muted)]">
              {previewMode
                ? "This is a preview — no response was actually recorded."
                : thankYouSubtitle || "Your response has been recorded."}
            </p>
          </motion.div>
        ) : step === -1 ? (
          <motion.div
            key="intro"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center"
          >
            <div className="max-w-xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{formTitle}</h1>
              {formDescription && (
                <p className="mt-4 text-base text-[var(--color-text-muted)] sm:text-lg">
                  {formDescription}
                </p>
              )}
            </div>
            <Button size="lg" onClick={goNext} disabled={total === 0}>
              {total === 0 ? "This form has no questions" : "Start"}{" "}
              {total > 0 && <ArrowRight className="size-4" />}
            </Button>
            {total > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-faint)]">
                Press Enter <ArrowDown className="size-3" />
              </span>
            )}
          </motion.div>
        ) : current ? (
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10"
          >
            <div className="w-full max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-semibold text-[var(--color-accent)]">
                  {step + 1}
                </span>
                of {total}
                {current.required && <span className="text-[var(--color-danger)]">Required</span>}
              </p>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {current.title}
              </h2>
              {current.description && (
                <p className="mt-3 text-[var(--color-text-muted)] sm:text-lg">
                  {current.description}
                </p>
              )}

              <div className="mt-8">
                <QuestionField
                  question={current}
                  value={answers[current.id] ?? ""}
                  onChange={(v) => setAnswer(current.id, v)}
                  inputRef={inputRef}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-sm text-[var(--color-danger)]"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-8 flex items-center gap-3">
                <Button onClick={goNext} isLoading={submitting}>
                  {step === total - 1 ? "Submit" : "OK"} <ArrowRight className="size-4" />
                </Button>
                {step > 0 && (
                  <Button variant="ghost" onClick={goPrev}>
                    <ArrowLeft className="size-4" /> Previous
                  </Button>
                )}
                <span className="hidden text-xs text-[var(--color-text-faint)] sm:inline">
                  press Enter ↵
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
