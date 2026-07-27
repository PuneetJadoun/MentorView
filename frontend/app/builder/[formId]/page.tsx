"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  Eye,
  ListChecks,
  Menu,
  Plus,
  Settings,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { QuestionList } from "@/components/builder/QuestionList";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { PreviewOverlay } from "@/components/builder/PreviewOverlay";
import { PublishSuccessModal } from "@/components/builder/PublishSuccessModal";
import { formsApi, questionsApi, getApiErrorMessage } from "@/lib/api";
import { FONT_OPTIONS } from "@/lib/types";
import type { FormDetail, FormUpdatePayload, Question } from "@/lib/types";

type Selection = { type: "settings" } | { type: "question"; id: number };

export default function BuilderPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId: formIdParam } = use(params);
  const formId = Number(formIdParam);

  const [form, setForm] = useState<FormDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selection, setSelection] = useState<Selection>({ type: "settings" });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccessUrl, setPublishSuccessUrl] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const updateFormField = async (patch: FormUpdatePayload) => {
    if (!form) return;
    try {
      const updated = await formsApi.update(form.id, patch);
      setForm(updated);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const selectQuestion = (id: number) => {
    setSelection({ type: "question", id });
    setMobileSidebarOpen(false);
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
      setMobileSidebarOpen(false);
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
      if (updated.status === "published") {
        setPublishSuccessUrl(`${window.location.origin}/f/${updated.share_id}`);
      } else {
        toast.success("Form unpublished");
      }
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
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] lg:hidden cursor-pointer"
              aria-label="Open questions panel"
            >
              <Menu className="size-4" />
            </button>
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] lg:flex"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="hidden min-w-0 flex-1 truncate text-sm font-medium sm:inline">
              {form.title || "Untitled Form"}
            </span>
            <Badge tone={form.status === "published" ? "success" : "neutral"}>
              {form.status === "published" ? "Published" : "Draft"}
            </Badge>
          </>
        }
        right={
          <>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-4" /> <span className="hidden sm:inline">Preview</span>
            </Button>
            {form.status === "published" && (
              <Button variant="secondary" onClick={copyShareLink}>
                <Copy className="size-4" /> <span className="hidden sm:inline">Copy link</span>
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
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          footer={
            <Button variant="secondary" className="w-full" onClick={addQuestion}>
              <Plus className="size-4" /> Add question
            </Button>
          }
        >
          <button
            onClick={() => {
              setSelection({ type: "settings" });
              setMobileSidebarOpen(false);
            }}
            className={`mb-2 flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
              selection.type === "settings"
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "hover:bg-[var(--color-bg-subtle)]"
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
            onSelect={selectQuestion}
            onDelete={deleteQuestion}
            onReorder={reorderQuestions}
          />
        </Sidebar>

        <main className="relative flex-1 overflow-y-auto">
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

          <button
            onClick={addQuestion}
            className="fixed bottom-6 right-6 z-30 flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-[var(--shadow-popover)] transition-all hover:bg-[var(--color-accent-hover)] hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Add question"
            title="Add question"
          >
            <Plus className="size-5" />
          </button>
        </main>
      </div>

      {previewOpen && (
        <PreviewOverlay
          form={form}
          questions={questions}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {publishSuccessUrl && (
        <PublishSuccessModal
          isOpen
          shareUrl={publishSuccessUrl}
          onClose={() => setPublishSuccessUrl(null)}
        />
      )}
    </div>
  );
}

const DEFAULT_ACCENT = "#2563eb";
const DEFAULT_BACKGROUND = "#fafaf9";

function FormSettingsPanel({
  form,
  onSave,
}: {
  form: FormDetail;
  onSave: (patch: FormUpdatePayload) => void;
}) {
  // Rendered with key={form.id} by the parent, so this remounts (and these
  // useState initializers re-run) whenever the loaded form actually changes.
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description ?? "");
  const [thankYouTitle, setThankYouTitle] = useState(form.thank_you_title ?? "");
  const [thankYouSubtitle, setThankYouSubtitle] = useState(form.thank_you_subtitle ?? "");

  return (
    <div className="animate-fade-in mx-auto flex max-w-2xl flex-col gap-6 p-6 sm:p-10">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Form settings</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          This title and description appear on the welcome screen respondents see first.
        </p>
      </div>

      <Card className="flex flex-col gap-5 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Form title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== form.title && onSave({ title: title.trim() })}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-base outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Description <span className="normal-case text-[var(--color-text-faint)]">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => description !== (form.description ?? "") && onSave({ description })}
            rows={3}
            className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold">Theme</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Applied to the public form respondents fill out — not to this builder.
        </p>
      </div>

      <Card className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Accent color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.theme_color ?? DEFAULT_ACCENT}
                onChange={(e) => onSave({ theme_color: e.target.value })}
                className="size-10 cursor-pointer rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent p-1"
              />
              <span className="text-sm text-[var(--color-text-muted)]">
                {form.theme_color ?? DEFAULT_ACCENT}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Background color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.background_color ?? DEFAULT_BACKGROUND}
                onChange={(e) => onSave({ background_color: e.target.value })}
                className="size-10 cursor-pointer rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent p-1"
              />
              <span className="text-sm text-[var(--color-text-muted)]">
                {form.background_color ?? DEFAULT_BACKGROUND}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-xs">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Font
          </label>
          <select
            value={form.font_family ?? FONT_OPTIONS[0].value}
            onChange={(e) => onSave({ font_family: e.target.value })}
            className="w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <Switch
          checked={form.dark_mode}
          onChange={(checked) => onSave({ dark_mode: checked })}
          label="Dark mode for respondents"
        />
      </Card>

      <div>
        <h3 className="text-sm font-semibold">Thank-you screen</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Shown after a respondent submits the form.
        </p>
      </div>

      <Card className="flex flex-col gap-5 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Title
          </label>
          <input
            value={thankYouTitle}
            onChange={(e) => setThankYouTitle(e.target.value)}
            onBlur={() =>
              thankYouTitle !== (form.thank_you_title ?? "") &&
              onSave({ thank_you_title: thankYouTitle || null })
            }
            placeholder="Thank you!"
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Subtitle
          </label>
          <input
            value={thankYouSubtitle}
            onChange={(e) => setThankYouSubtitle(e.target.value)}
            onBlur={() =>
              thankYouSubtitle !== (form.thank_you_subtitle ?? "") &&
              onSave({ thank_you_subtitle: thankYouSubtitle || null })
            }
            placeholder="Your response has been recorded."
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>
      </Card>
    </div>
  );
}
