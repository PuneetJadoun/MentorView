"use client";

import { useEffect, useState } from "react";
import { FileQuestion, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormCard } from "@/components/dashboard/FormCard";
import { CreateFormModal } from "@/components/dashboard/CreateFormModal";
import { formsApi, getApiErrorMessage } from "@/lib/api";
import type { FormListItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormListItem[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    formsApi
      .list()
      .then(setForms)
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, []);

  const handleCreate = async (values: { title: string; description?: string }) => {
    try {
      const form = await formsApi.create(values);
      toast.success("Form created");
      setModalOpen(false);
      router.push(`/builder/${form.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (formId: number) => {
    if (!confirm("Delete this form and all of its responses? This can't be undone.")) return;
    try {
      await formsApi.delete(formId);
      setForms((prev) => prev?.filter((f) => f.id !== formId) ?? null);
      toast.success("Form deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar
        right={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Create form
          </Button>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Your forms</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Create, edit, and track the forms you own.
          </p>
        </div>

        {forms === null ? (
          <Loader label="Loading your forms..." />
        ) : forms.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No forms yet"
            description="Create your first form to start collecting responses."
            action={
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="size-4" /> Create form
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <CreateFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
