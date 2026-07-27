import { Card } from "@/components/ui/Card";
import { getRelativeTime } from "@/lib/date";

interface ResponseStatsProps {
  total: number;
  completed: number;
  lastResponseAt: string | null;
}

export function ResponseStats({ total, completed, lastResponseAt }: ResponseStatsProps) {
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total responses", value: total },
    { label: "Completed", value: completed },
    { label: "Completion rate", value: `${rate}%` },
    { label: "Last response", value: lastResponseAt ? getRelativeTime(lastResponseAt) : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="px-4 py-4 sm:px-5">
          <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)] sm:text-sm">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
