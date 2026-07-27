"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Copy, Eye, ListChecks, Plus, Settings, Share2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { QuestionList } from "@/components/builder/QuestionList";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { PreviewOverlay } from "@/components/builder/PreviewOverlay";
import { formsApi, questionsApi, getApiErrorMessage } from "@/lib/api";
import type { FormDetail, Question } from "@/lib/types";

type Selection = { type: "settings" } | { type: "question"; id: number };

export default function BuilderPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId: formIdParam } = use(params);
  const formId = Number(formIdParam);

  const [form, setForm] = useState<FormDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selection, setSelection] = useState<Selection>({ type: "settings" });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    Promise.all([formsApi.get(formId), questionsApi.listForForm(formId)])
      .then(([formData, questionData]) => {
        setForm(formData);
        setQuestions(questionData);
        if (questionData.length > 0) setSelection({ type: "question", id: questionData[0].id });
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [formId]);

  const selectedQuestion =
    selection.type === "question" ? questions.find((q) => q.id === selection.id) ?? null : null;

  const updateFormField = async (patch: { title?: string; description?: string | null }) => {
    if (!form) return;
    try {
      const updated = await formsApi.update(form.id, patch);
      setForm(updated);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const addQuestion = async () => {
    try {
      const created = await questionsApi.create(formId, {
        title: "New question",
        type: "short_text",
        required: false,
      });
      setQuestions((prev) => [...prev, created]);
      setSelection({ type: "question", id: created.id });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const deleteQuestion = async (questionId: number) => {
    if (!confirm("Delete this question?")) return;
    try {
      await questionsApi.delete(questionId);
      setQuestions((prev) => {
        const next = prev.filter((q) => q.id !== questionId);
        if (selection.type === "question" && selection.id === questionId) {
          setSelection(next.length > 0 ? { type: "question", id: next[0].id } : { type: "settings" });
        }
        return next;
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const reorderQuestions = async (orderedIds: number[]) => {
    const byId = new Map(questions.map((q) => [q.id, q]));
    const optimistic = orderedIds
      .map((id, i) => {
        const q = byId.get(id);
        return q ? { ...q, position: i + 1 } : null;
      })
      .filter((q): q is Question => q !== null);
    setQuestions(optimistic);

    try {
      await questionsApi.reorder(
        formId,
        orderedIds.map((id, i) => ({ question_id: id, position: i + 1 }))
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handlePublishToggle = async () => {
    if (!form) return;
    if (form.status === "draft" && questions.length === 0) {
      toast.error("Add at least one question before publishing.");
      return;
    }
    setPublishing(true);
    try {
      const updated =
        form.status === "draft" ? await formsApi.publish(form.id) : await formsApi.unpublish(form.id);
      setForm(updated);
      toast.success(updated.status === "published" ? "Form published" : "Form unpublished");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setPublishing(false);
    }
  };

  const copyShareLink = () => {
    if (!form) return;
    const url = `${window.location.origin}/f/${form.share_id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard");
  };

  if (!form) {
    return <Loader label="Loading form..." />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar
        left={
          <>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="truncate text-sm font-medium">{form.title || "Untitled Form"}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                form.status === "published" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {form.status === "published" ? "Published" : "Draft"}
            </span>
          </>
        }
        right={
          <>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-4" /> Preview
            </Button>
            {form.status === "published" && (
              <Button variant="secondary" onClick={copyShareLink}>
                <Copy className="size-4" /> Copy link
              </Button>
            )}
            <Button
              variant={form.status === "published" ? "secondary" : "primary"}
              onClick={handlePublishToggle}
              isLoading={publishing}
            >
              <Share2 className="size-4" />
              {form.status === "published" ? "Unpublish" : "Publish"}
            </Button>
          </>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          footer={
            <Button variant="secondary" className="w-full" onClick={addQuestion}>
              <Plus className="size-4" /> Add question
            </Button>
          }
        >
          <button
            onClick={() => setSelection({ type: "settings" })}
            className={`mb-2 flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
              selection.type === "settings"
                ? "bg-[var(--color-accent)]/5 text-[var(--color-accent)]"
                : "hover:bg-neutral-100"
            }`}
          >
            <Settings className="size-4" /> Form settings
          </button>

          <div className="mb-2 flex items-center gap-1.5 px-2.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            <ListChecks className="size-3.5" /> Questions ({questions.length})
          </div>

          <QuestionList
            questions={questions}
            selectedId={selection.type === "question" ? selection.id : null}
            onSelect={(id) => setSelection({ type: "question", id })}
            onDelete={deleteQuestion}
            onReorder={reorderQuestions}
          />
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          {selection.type === "settings" ? (
            <FormSettingsPanel key={form.id} form={form} onSave={updateFormField} />
          ) : selectedQuestion ? (
            <QuestionEditor
              key={selectedQuestion.id}
              question={selectedQuestion}
              onChange={(updated) =>
                setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
              }
            />
          ) : null}
        </main>
      </div>

      {previewOpen && (
        <PreviewOverlay
          formTitle={form.title}
          formDescription={form.description}
          questions={questions}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}

function FormSettingsPanel({
  form,
  onSave,
}: {
  form: FormDetail;
  onSave: (patch: { title?: string; description?: string | null }) => void;
}) {
  // Rendered with key={form.id} by the parent, so this remounts (and these
  // useState initializers re-run) whenever the loaded form actually changes.
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description ?? "");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h2 className="text-lg font-semibold">Form settings</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          This title and description appear on the welcome screen respondents see first.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Form title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== form.title && onSave({ title: title.trim() })}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-base outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Description <span className="text-[var(--color-text-muted)]">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (form.description ?? "") && onSave({ description })}
          rows={3}
          className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
      </div>

      <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
        Theme (colors, fonts, background) and a custom thank-you screen are coming soon.
      </div>
    </div>
  );
}
