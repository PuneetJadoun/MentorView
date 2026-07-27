import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ResponseListItem } from "@/lib/types";

interface ResponseCardProps {
  response: ResponseListItem;
  onClick: () => void;
}

export function ResponseCard({ response, onClick }: ResponseCardProps) {
  return (
    <Card
      hoverable
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
    >
      <div className="flex items-center gap-3">
        {response.completed ? (
          <CheckCircle2 className="size-5 shrink-0 text-green-600" />
        ) : (
          <Circle className="size-5 shrink-0 text-neutral-300" />
        )}
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            Response #{response.response_id}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {response.submitted_at
              ? new Date(response.submitted_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "Not submitted"}
          </p>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-neutral-300" />
    </Card>
  );
}
