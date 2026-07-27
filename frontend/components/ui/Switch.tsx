interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex w-fit max-w-full shrink-0 cursor-pointer items-center gap-2.5 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`inline-flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
          checked ? "bg-[var(--color-accent)]" : "bg-[var(--color-border-strong)]"
        }`}
      >
        <span
          className={`size-5 shrink-0 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      )}
    </label>
  );
}
