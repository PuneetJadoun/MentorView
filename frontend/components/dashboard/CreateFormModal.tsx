"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(2000).optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (values: FormValues) => Promise<void>;
}

export function CreateFormModal({ isOpen, onClose, onCreate }: CreateFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = async (values: FormValues) => {
    await onCreate(values);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a new form">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Title
          </label>
          <input
            {...register("title")}
            autoFocus
            placeholder="Customer Feedback"
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Description <span className="text-[var(--color-text-muted)]">(optional)</span>
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="What is this form for?"
            className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create form
          </Button>
        </div>
      </form>
    </Modal>
  );
}
