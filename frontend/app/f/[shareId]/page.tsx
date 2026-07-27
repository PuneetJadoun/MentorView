"use client";

import { use, useEffect, useState } from "react";
import { FileX2 } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormRunner } from "@/components/public-form/FormRunner";
import { getApiErrorMessage, publicApi } from "@/lib/api";
import type { PublicForm } from "@/lib/types";

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = use(params);
  const [form, setForm] = useState<PublicForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .getForm(shareId)
      .then(setForm)
      .catch((err) => setError(getApiErrorMessage(err)));
  }, [shareId]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <EmptyState
          icon={FileX2}
          title="This form isn't available"
          description={error}
        />
      </div>
    );
  }

  if (!form) {
    return <Loader label="Loading form..." />;
  }

  return (
    <FormRunner
      formTitle={form.title}
      formDescription={form.description}
      questions={form.questions}
      accentColor={form.theme_color}
      backgroundColor={form.background_color}
      fontFamily={form.font_family}
      darkMode={form.dark_mode}
      thankYouTitle={form.thank_you_title}
      thankYouSubtitle={form.thank_you_subtitle}
      onSubmit={async (answers) => {
        try {
          await publicApi.submit(shareId, answers);
        } catch (err) {
          throw new Error(getApiErrorMessage(err));
        }
      }}
    />
  );
}
