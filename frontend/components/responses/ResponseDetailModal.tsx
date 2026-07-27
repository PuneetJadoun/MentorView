"use client";

import { X } from "lucide-react";
import type { ResponseDetail } from "@/lib/types";

interface ResponseDetailModalProps {
  response: ResponseDetail | null;
  isLoading: boolean;
  onClose: () => void;
}

export function ResponseDetailModal({ response, isLoading, onClose }: ResponseDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {response ? `Response #${response.response_id}` : "Response"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {isLoading || !response ? (
          <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">Loading...</p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Submitted{" "}
              {response.submitted_at
                ? new Date(response.submitted_at).toLocaleString()
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
                    {answer.answer || <span className="italic text-neutral-400">No answer</span>}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
