import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable, className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ${
        hoverable ? "transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
