# Database Schema

## Overview

The application uses **SQLite** as the database.

The schema is designed to support:

### Core Features

- Form Builder
- Form CRUD
- Publish / Unpublish
- Shareable Public Forms
- Multiple Question Types
- Responses
- Summary Statistics

### Bonus Features

- Logic Jumps / Conditional Branching
- Custom Themes
- Dark Mode
- Export Responses as CSV
- Partial Response Tracking
- File Upload Question Type

---

# Entity Relationship Diagram

```text
forms
   │
   ├──────────────┐
   │              │
   ▼              ▼
questions      responses
   │              │
   ▼              ▼
question_options answers
   │
   ▼
logic_rules
```

---

# Tables

## 1. forms

Stores all created forms.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER PK | Form ID |
| title | TEXT | Form title |
| description | TEXT | Optional form description |
| status | TEXT | draft / published |
| share_id | TEXT UNIQUE | Public shareable identifier |
| theme_color | TEXT | Theme accent color |
| background_color | TEXT | Background color |
| font_family | TEXT | Selected font |
| dark_mode | BOOLEAN | Enable dark mode |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last updated timestamp |

---

## 2. questions

Stores all questions belonging to a form.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER PK | Question ID |
| form_id | INTEGER FK | Parent form |
| title | TEXT | Question text |
| description | TEXT | Help text |
| type | TEXT | Question type |
| required | BOOLEAN | Required question |
| position | INTEGER | Display order |
| allow_multiple_files | BOOLEAN | File upload setting (Bonus) |

### Supported Question Types

- SHORT_TEXT
- LONG_TEXT
- EMAIL
- NUMBER
- MULTIPLE_CHOICE
- DROPDOWN
- YES_NO
- RATING
- FILE_UPLOAD *(Bonus)*

---

## 3. question_options

Stores selectable options.

Used only by:

- Multiple Choice
- Dropdown

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER PK | Option ID |
| question_id | INTEGER FK | Parent question |
| option_text | TEXT | Option label |
| position | INTEGER | Display order |

---

## 4. logic_rules (Bonus)

Supports conditional branching.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER PK | Rule ID |
| question_id | INTEGER FK | Source question |
| option_id | INTEGER FK | Selected option |
| target_question_id | INTEGER FK | Next question |

Example:

```
Question:
Do you own a car?

↓

Option:
Yes

↓

Jump to:
Car Details
```

---

## 5. responses

Stores every submitted form.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER PK | Response ID |
| form_id | INTEGER FK | Parent form |
| completed | BOOLEAN | Completed or partial |
| progress_percentage | INTEGER | Completion percentage |
| started_at | DATETIME | Response start time |
| submitted_at | DATETIME | Submission time |

Used for:

- Response History
- Partial Responses *(Bonus)*
- Completion Rate *(Bonus)*

---

## 6. answers

Stores answers for every question.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER PK | Answer ID |
| response_id | INTEGER FK | Parent response |
| question_id | INTEGER FK | Parent question |
| answer_value | TEXT | Text/Email/Number/Rating/Yes-No answer |
| file_path | TEXT | Uploaded file path *(Bonus)* |

Examples:

Short Text

```
Puneet Kumar
```

Rating

```
5
```

Yes / No

```
true
```

File Upload

```
uploads/resume.pdf
```

---

# Relationships

## Form → Questions

```
1 Form
      │
      ▼
Many Questions
```

---

## Question → Options

```
1 Question
      │
      ▼
Many Options
```

---

## Form → Responses

```
1 Form
      │
      ▼
Many Responses
```

---

## Response → Answers

```
1 Response
      │
      ▼
Many Answers
```

---

## Question → Logic Rules

```
1 Question
      │
      ▼
Many Logic Rules
```

---

# Design Decisions

- SQLite chosen as required by the assignment.
- Normalized schema to avoid redundant data.
- Generic `answer_value` supports all primitive question types.
- Separate `question_options` table avoids storing arrays.
- `logic_rules` keeps conditional branching modular.
- Theme configuration stored per form.
- Partial response tracking stored in the `responses` table.
- File uploads reuse the `answers` table using `file_path`.

---

# Tables Summary

| Table | Purpose |
|--------|---------|
| forms | Form metadata |
| questions | Questions belonging to a form |
| question_options | Options for MCQ & Dropdown |
| logic_rules | Conditional branching |
| responses | Submitted responses |
| answers | Individual answers |

**Total Tables:** **6**