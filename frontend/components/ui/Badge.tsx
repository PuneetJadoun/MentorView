type Tone = "success" | "neutral" | "danger" | "accent";

const toneClasses: Record<Tone, string> = {
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]",
  danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
};

const dotClasses: Record<Tone, string> = {
  success: "bg-[var(--color-success)]",
  neutral: "bg-[var(--color-text-faint)]",
  danger: "bg-[var(--color-danger)]",
  accent: "bg-[var(--color-accent)]",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      <span className={`size-1.5 rounded-full ${dotClasses[tone]}`} />
      {children}
    </span>
  );
}
