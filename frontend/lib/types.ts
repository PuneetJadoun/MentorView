// Mirrors backend/app/schemas/*.py exactly — keep in sync with those files.

export type FormStatus = "draft" | "published";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "date"
  | "yes_no"
  | "multiple_choice"
  | "checkbox"
  | "dropdown";

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "yes_no", label: "Yes / No" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkbox" },
  { value: "dropdown", label: "Dropdown" },
];

export const OPTION_BASED_TYPES: QuestionType[] = ["multiple_choice", "checkbox", "dropdown"];

export const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: "Inter, sans-serif", label: "Inter (default)" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "system-ui, sans-serif", label: "System UI" },
];

// ---- Forms ----

export interface FormListItem {
  id: number;
  title: string;
  status: FormStatus;
  updated_at: string;
}

export interface FormDetail {
  id: number;
  title: string;
  description: string | null;
  status: FormStatus;
  share_id: string;
  theme_color: string | null;
  background_color: string | null;
  font_family: string | null;
  dark_mode: boolean;
  thank_you_title: string | null;
  thank_you_subtitle: string | null;
}

export interface FormCreatePayload {
  title: string;
  description?: string | null;
}

export interface FormUpdatePayload {
  title?: string;
  description?: string | null;
  theme_color?: string | null;
  background_color?: string | null;
  font_family?: string | null;
  dark_mode?: boolean;
  thank_you_title?: string | null;
  thank_you_subtitle?: string | null;
}

// ---- Questions ----

export interface QuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  position: number;
}

export interface Question {
  id: number;
  form_id: number;
  title: string;
  description: string | null;
  type: QuestionType;
  required: boolean;
  position: number;
  options: QuestionOption[];
}

export interface QuestionCreatePayload {
  title: string;
  description?: string | null;
  type: QuestionType;
  required?: boolean;
  position?: number;
}

export interface QuestionUpdatePayload {
  title?: string;
  description?: string | null;
  type?: QuestionType;
  required?: boolean;
}

export interface QuestionReorderItem {
  question_id: number;
  position: number;
}

export interface QuestionOptionCreatePayload {
  option_text: string;
}

export interface QuestionOptionUpdatePayload {
  option_text: string;
}

// ---- Public form fill ----

export interface PublicOption {
  id: number;
  option_text: string;
  position: number;
}

export interface PublicQuestion {
  id: number;
  title: string;
  description: string | null;
  type: QuestionType;
  required: boolean;
  position: number;
  options: PublicOption[];
}

export interface PublicForm {
  id: number;
  title: string;
  description: string | null;
  theme_color: string | null;
  background_color: string | null;
  font_family: string | null;
  dark_mode: boolean;
  thank_you_title: string | null;
  thank_you_subtitle: string | null;
  questions: PublicQuestion[];
}

export interface PublicAnswerSubmit {
  question_id: number;
  answer: string;
}

export interface PublicSubmitResponse {
  response_id: number;
  message: string;
}

// ---- Responses ----

export interface ResponseListItem {
  response_id: number;
  submitted_at: string | null;
  completed: boolean;
}

export interface AnswerDetail {
  question: string;
  answer: string | null;
}

export interface ResponseDetail {
  response_id: number;
  submitted_at: string | null;
  completed: boolean;
  answers: AnswerDetail[];
}
