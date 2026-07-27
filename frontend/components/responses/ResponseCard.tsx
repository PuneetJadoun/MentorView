import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatIST } from "@/lib/date";
import type { ResponseListItem } from "@/lib/types";

interface ResponseCardProps {
  response: ResponseListItem;
  onClick: () => void;
}

export function ResponseCard({ response, onClick }: ResponseCardProps) {
  return (
    <button
      onClick={onClick}
      className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-[var(--color-border)] px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-[var(--color-bg-subtle)] sm:px-5"
    >
      <span className="text-sm font-medium text-[var(--color-text-muted)]">
        #{response.response_id}
      </span>
      <span className="min-w-0 truncate text-sm text-[var(--color-text)]">
        {response.submitted_at
          ? formatIST(response.submitted_at, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : "Not submitted"}
      </span>
      <Badge tone={response.completed ? "success" : "neutral"}>
        {response.completed ? "Completed" : "Partial"}
      </Badge>
      <ChevronRight className="size-4 shrink-0 text-[var(--color-text-faint)]" />
    </button>
  );
}

export function ResponseCardSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-[var(--color-border)] px-4 py-3.5 last:border-0 sm:px-5">
      <div className="skeleton h-4 w-8 rounded" />
      <div className="skeleton h-4 w-40 rounded" />
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton size-4 rounded" />
    </div>
  );
}
