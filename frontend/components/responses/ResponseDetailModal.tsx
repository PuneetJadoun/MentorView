"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatIST } from "@/lib/date";
import type { ResponseDetail } from "@/lib/types";

interface ResponseDetailModalProps {
  response: ResponseDetail | null;
  isLoading: boolean;
  onClose: () => void;
}

export function ResponseDetailModal({ response, isLoading, onClose }: ResponseDetailModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 4 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-popover)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold tracking-tight">
                {response ? `Response #${response.response_id}` : "Response"}
              </h2>
              {response && (
                <Badge tone={response.completed ? "success" : "neutral"}>
                  {response.completed ? "Completed" : "Partial"}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[var(--color-text-faint)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)] cursor-pointer"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>

          {isLoading || !response ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton mt-2 h-4 w-full rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[var(--color-text-muted)]">
                Submitted{" "}
                {response.submitted_at
                  ? formatIST(response.submitted_at, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      second: "numeric",
                    })
                  : "— not submitted"}
              </p>
              {response.answers.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No answers recorded.</p>
              ) : (
                response.answers.map((answer, i) => (
                  <div key={i} className="border-b border-[var(--color-border)] pb-3 last:border-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                      {answer.question}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      {answer.answer || (
                        <span className="italic text-[var(--color-text-faint)]">No answer</span>
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
