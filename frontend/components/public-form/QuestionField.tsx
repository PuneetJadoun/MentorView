"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { QuestionType } from "@/lib/types";

interface FieldOption {
  id: number;
  option_text: string;
}

interface FieldQuestion {
  id: number;
  type: QuestionType;
  options: FieldOption[];
}

interface QuestionFieldProps {
  question: FieldQuestion;
  value: string;
  onChange: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

const baseInputClass =
  "w-full border-b-2 border-[var(--color-border-strong)] bg-transparent py-3 text-2xl sm:text-3xl font-medium outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-text-faint)] placeholder:font-normal";

export function QuestionField({ question, value, onChange, inputRef }: QuestionFieldProps) {
  switch (question.type) {
    case "short_text":
    case "email":
    case "number":
    case "date":
      return (
        <input
          ref={inputRef as RefObject<HTMLInputElement>}
          type={question.type === "short_text" ? "text" : question.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          className={baseInputClass}
        />
      );

    case "long_text":
      return (
        <textarea
          ref={inputRef as RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="Type your answer here..."
          className={`${baseInputClass} resize-none`}
        />
      );

    case "yes_no":
      return (
        <div className="flex gap-3">
          {["Yes", "No"].map((option) => (
            <motion.button
              key={option}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(option)}
              className={`flex-1 cursor-pointer rounded-[var(--radius-md)] border-2 px-6 py-4 text-lg font-medium transition-colors ${
                value === option
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      );

    case "multiple_choice":
      return (
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, i) => (
            <motion.button
              key={option.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.option_text)}
              className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border-2 px-4 py-3.5 text-left text-base transition-colors ${
                value === option.option_text
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${
                  value === option.option_text
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-[var(--color-border-strong)] text-[var(--color-text-muted)]"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option.option_text}
            </motion.button>
          ))}
        </div>
      );

    case "checkbox": {
      const selected = value ? value.split(", ").filter(Boolean) : [];
      const toggle = (text: string) => {
        const next = selected.includes(text)
          ? selected.filter((t) => t !== text)
          : [...selected, text];
        onChange(next.join(", "));
      };
      return (
        <div className="flex flex-col gap-2.5">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.option_text);
            return (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(option.option_text)}
                className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border-2 px-4 py-3.5 text-left text-base transition-colors ${
                  isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded border-2 ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)]"
                  }`}
                >
                  {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                </span>
                {option.option_text}
              </motion.button>
            );
          })}
        </div>
      );
    }

    case "dropdown":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} cursor-pointer !bg-[var(--color-surface)]`}
        >
          <option value="" disabled>
            Choose an option
          </option>
          {question.options.map((option) => (
            <option key={option.id} value={option.option_text}>
              {option.option_text}
            </option>
          ))}
        </select>
      );

    default:
      return null;
  }
}
