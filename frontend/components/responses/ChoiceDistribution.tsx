import { Card } from "@/components/ui/Card";
import { OPTION_BASED_TYPES } from "@/lib/types";
import type { Question, ResponseDetail } from "@/lib/types";

interface ChoiceDistributionProps {
  questions: Question[];
  details: ResponseDetail[];
}

interface OptionCount {
  label: string;
  count: number;
}

function countsForQuestion(
  question: Question,
  details: ResponseDetail[]
): { counts: OptionCount[]; totalAnswered: number } {
  const counts = new Map<string, number>();
  question.options.forEach((o) => counts.set(o.option_text, 0));

  let totalAnswered = 0;
  for (const detail of details) {
    const answer = detail.answers.find((a) => a.question === question.title);
    if (!answer || !answer.answer) continue;
    totalAnswered += 1;
    // Checkbox answers are stored as a single comma-joined string
    // (e.g. "Apple, Banana"), so each selected option is split back out.
    const values =
      question.type === "checkbox" ? answer.answer.split(", ").filter(Boolean) : [answer.answer];
    for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return {
    counts: Array.from(counts.entries()).map(([label, count]) => ({ label, count })),
    totalAnswered,
  };
}

export function ChoiceDistribution({ questions, details }: ChoiceDistributionProps) {
  const optionQuestions = questions.filter(
    (q) => OPTION_BASED_TYPES.includes(q.type) && q.options.length > 0
  );

  if (optionQuestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        Choice distribution
      </h2>
      {optionQuestions.map((question) => {
        const { counts, totalAnswered } = countsForQuestion(question, details);
        const maxCount = Math.max(1, ...counts.map((c) => c.count));
        return (
          <Card key={question.id} className="p-5">
            <p className="mb-4 text-sm font-medium">{question.title}</p>
            <div className="flex flex-col gap-3">
              {counts.map((c) => {
                const pct = totalAnswered > 0 ? Math.round((c.count / totalAnswered) * 100) : 0;
                return (
                  <div key={c.label}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-[var(--color-text)]">{c.label}</span>
                      <span className="shrink-0 text-[var(--color-text-muted)]">
                        {c.count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500 ease-out"
                        style={{ width: `${(c.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-faint)]">
              {totalAnswered} {totalAnswered === 1 ? "response" : "responses"} to this question
            </p>
          </Card>
        );
      })}
    </div>
  );
}
