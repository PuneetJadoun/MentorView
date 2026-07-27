"use client";

import { useState } from "react";
import { Check, Copy, PartyPopper } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export function PublishSuccessModal({ isOpen, onClose, shareUrl }: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-success-soft)]">
          <PartyPopper className="size-7 text-[var(--color-success)]" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Your form is live!</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Anyone with this link can now fill out your form.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-1.5 pl-3.5">
          <span className="flex-1 truncate text-left text-sm text-[var(--color-text-muted)]">
            {shareUrl}
          </span>
          <Button size="sm" variant={copied ? "secondary" : "primary"} onClick={handleCopy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <Button variant="ghost" onClick={onClose} className="mt-1">
          Continue editing
        </Button>
      </div>
    </Modal>
  );
}
