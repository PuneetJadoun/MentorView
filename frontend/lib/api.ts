import axios from "axios";
import type {
  AnswerDetail,
  FormCreatePayload,
  FormDetail,
  FormListItem,
  FormUpdatePayload,
  PublicAnswerSubmit,
  PublicForm,
  PublicSubmitResponse,
  Question,
  QuestionCreatePayload,
  QuestionOption,
  QuestionOptionCreatePayload,
  QuestionOptionUpdatePayload,
  QuestionReorderItem,
  QuestionUpdatePayload,
  ResponseDetail,
  ResponseListItem,
} from "./types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

/** Extracts a FastAPI error `detail` string, falling back to a generic message. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return "Something went wrong. Please try again.";
}

// ---- Forms ----

export const formsApi = {
  list: () => apiClient.get<FormListItem[]>("/forms").then((r) => r.data),
  get: (formId: number) => apiClient.get<FormDetail>(`/forms/${formId}`).then((r) => r.data),
  create: (payload: FormCreatePayload) =>
    apiClient.post<FormDetail>("/forms", payload).then((r) => r.data),
  update: (formId: number, payload: FormUpdatePayload) =>
    apiClient.put<FormDetail>(`/forms/${formId}`, payload).then((r) => r.data),
  delete: (formId: number) => apiClient.delete(`/forms/${formId}`),
  publish: (formId: number) =>
    apiClient.post<FormDetail>(`/forms/${formId}/publish`).then((r) => r.data),
  unpublish: (formId: number) =>
    apiClient.post<FormDetail>(`/forms/${formId}/unpublish`).then((r) => r.data),
};

// ---- Questions ----

export const questionsApi = {
  listForForm: (formId: number) =>
    apiClient.get<Question[]>(`/forms/${formId}/questions`).then((r) => r.data),
  get: (questionId: number) =>
    apiClient.get<Question>(`/questions/${questionId}`).then((r) => r.data),
  create: (formId: number, payload: QuestionCreatePayload) =>
    apiClient.post<Question>(`/forms/${formId}/questions`, payload).then((r) => r.data),
  update: (questionId: number, payload: QuestionUpdatePayload) =>
    apiClient.put<Question>(`/questions/${questionId}`, payload).then((r) => r.data),
  delete: (questionId: number) => apiClient.delete(`/questions/${questionId}`),
  reorder: (formId: number, items: QuestionReorderItem[]) =>
    apiClient
      .patch<Question[]>(`/forms/${formId}/questions/reorder`, items)
      .then((r) => r.data),
  createOption: (questionId: number, payload: QuestionOptionCreatePayload) =>
    apiClient
      .post<QuestionOption>(`/questions/${questionId}/options`, payload)
      .then((r) => r.data),
  updateOption: (optionId: number, payload: QuestionOptionUpdatePayload) =>
    apiClient.put<QuestionOption>(`/options/${optionId}`, payload).then((r) => r.data),
  deleteOption: (optionId: number) => apiClient.delete(`/options/${optionId}`),
};

// ---- Public form fill ----

export const publicApi = {
  getForm: (shareId: string) =>
    apiClient.get<PublicForm>(`/public/${shareId}`).then((r) => r.data),
  submit: (shareId: string, answers: PublicAnswerSubmit[]) =>
    apiClient
      .post<PublicSubmitResponse>(`/public/${shareId}/submit`, { answers })
      .then((r) => r.data),
};

// ---- Responses ----

export const responsesApi = {
  listForForm: (formId: number) =>
    apiClient.get<ResponseListItem[]>(`/forms/${formId}/responses`).then((r) => r.data),
  get: (responseId: number) =>
    apiClient.get<ResponseDetail>(`/responses/${responseId}`).then((r) => r.data),
  exportCsvUrl: (formId: number) =>
    `${apiClient.defaults.baseURL}/forms/${formId}/responses/export`,
};

export type { AnswerDetail };
