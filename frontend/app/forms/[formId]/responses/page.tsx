"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Download, Inbox } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponseCard, ResponseCardSkeleton } from "@/components/responses/ResponseCard";
import { ResponseStats } from "@/components/responses/ResponseStats";
import { ResponseDetailModal } from "@/components/responses/ResponseDetailModal";
import { ChoiceDistribution } from "@/components/responses/ChoiceDistribution";
import { formsApi, questionsApi, responsesApi, getApiErrorMessage } from "@/lib/api";
import type { FormDetail, Question, ResponseDetail, ResponseListItem } from "@/lib/types";

type StatusFilter = "all" | "completed" | "partial";

export default function ResponsesPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId: formIdParam } = use(params);
  const formId = Number(formIdParam);

  const [form, setForm] = useState<FormDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<ResponseListItem[] | null>(null);
  const [allDetails, setAllDetails] = useState<ResponseDetail[] | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedResponse, setSelectedResponse] = useState<ResponseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      formsApi.get(formId),
      questionsApi.listForForm(formId),
      responsesApi.listForForm(formId),
    ])
      .then(([formData, questionData, responseData]) => {
        setForm(formData);
        setQuestions(questionData);
        setResponses(responseData);
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [formId]);

  // Choice-distribution analytics need every response's individual answers,
  // which the list endpoint doesn't include — fetched separately, once the
  // response list is known, entirely from the existing per-response endpoint
  // (no new backend calls).
  useEffect(() => {
    if (!responses || responses.length === 0) return;
    Promise.all(responses.map((r) => responsesApi.get(r.response_id)))
      .then(setAllDetails)
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [responses]);

  const completedCount = useMemo(
    () => responses?.filter((r) => r.completed).length ?? 0,
    [responses]
  );

  const lastResponseAt = useMemo(() => {
    if (!responses || responses.length === 0) return null;
    const timestamps = responses.map((r) => r.submitted_at).filter((t): t is string => Boolean(t));
    if (timestamps.length === 0) return null;
    return timestamps.reduce((latest, t) => (t > latest ? t : latest));
  }, [responses]);

  const filteredResponses = useMemo(() => {
    if (!responses) return [];
    if (filter === "completed") return responses.filter((r) => r.completed);
    if (filter === "partial") return responses.filter((r) => !r.completed);
    return responses;
  }, [responses, filter]);

  const openResponse = async (responseId: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const detail = await responsesApi.get(responseId);
      setSelectedResponse(detail);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar
        left={
          <>
            <Link
              href={`/builder/${formId}`}
              className="flex items-center gap-1.5 rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
              aria-label="Back to builder"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {form?.title ?? "Responses"}
            </span>
          </>
        }
        right={
          <a href={responsesApi.exportCsvUrl(formId)} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              <Download className="size-4" /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </a>
        }
      />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Responses</h1>
          <p className="mt-1 text-[15px] text-[var(--color-text-muted)]">
            See everything respondents have submitted for this form.
          </p>
        </div>

        {responses === null ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-[var(--radius-lg)]" />
              ))}
            </div>
            <Card className="overflow-hidden p-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <ResponseCardSkeleton key={i} />
              ))}
            </Card>
          </div>
        ) : responses.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No responses yet"
            description="Share your form's public link to start collecting responses."
          />
        ) : (
          <div className="flex flex-col gap-6">
            <ResponseStats
              total={responses.length}
              completed={completedCount}
              lastResponseAt={lastResponseAt}
            />

            <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-sm w-fit">
              {(["all", "completed", "partial"] as StatusFilter[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-3.5 py-1.5 font-medium capitalize transition-colors cursor-pointer ${
                    filter === option
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {filteredResponses.length === 0 ? (
              <EmptyState icon={Inbox} title="No responses match this filter" />
            ) : (
              <Card className="overflow-hidden p-0">
                {filteredResponses.map((response) => (
                  <ResponseCard
                    key={response.response_id}
                    response={response}
                    onClick={() => openResponse(response.response_id)}
                  />
                ))}
              </Card>
            )}

            {allDetails && <ChoiceDistribution questions={questions} details={allDetails} />}
          </div>
        )}
      </main>

      {detailOpen && (
        <ResponseDetailModal
          response={selectedResponse}
          isLoading={detailLoading}
          onClose={() => {
            setDetailOpen(false);
            setSelectedResponse(null);
          }}
        />
      )}
    </div>
  );
}
