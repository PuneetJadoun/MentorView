"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Download, Inbox } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponseCard } from "@/components/responses/ResponseCard";
import { ResponseDetailModal } from "@/components/responses/ResponseDetailModal";
import { formsApi, responsesApi, getApiErrorMessage } from "@/lib/api";
import type { FormDetail, ResponseDetail, ResponseListItem } from "@/lib/types";

export default function ResponsesPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId: formIdParam } = use(params);
  const formId = Number(formIdParam);

  const [form, setForm] = useState<FormDetail | null>(null);
  const [responses, setResponses] = useState<ResponseListItem[] | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<ResponseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    Promise.all([formsApi.get(formId), responsesApi.listForForm(formId)])
      .then(([formData, responseData]) => {
        setForm(formData);
        setResponses(responseData);
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [formId]);

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

  if (!form || responses === null) {
    return <Loader label="Loading responses..." />;
  }

  return (
    <div className="min-h-screen">
      <Navbar
        left={
          <>
            <Link
              href={`/builder/${formId}`}
              className="flex items-center gap-1.5 rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
              aria-label="Back to builder"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="truncate text-sm font-medium">{form.title}</span>
          </>
        }
        right={
          <a href={responsesApi.exportCsvUrl(formId)} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              <Download className="size-4" /> Export CSV
            </Button>
          </a>
        }
      />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Responses</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {responses.length} {responses.length === 1 ? "response" : "responses"} collected so far.
          </p>
        </div>

        {responses.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No responses yet"
            description="Share your form's public link to start collecting responses."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {responses.map((response) => (
              <ResponseCard
                key={response.response_id}
                response={response}
                onClick={() => openResponse(response.response_id)}
              />
            ))}
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
