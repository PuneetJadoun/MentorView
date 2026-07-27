# Database Schema

## Overview

The application uses **SQLite** as the primary relational database. The schema is designed using a normalized relational model to efficiently support form creation, publishing, response collection, and analytics while remaining lightweight and easy to maintain.

The database supports both the required assignment features and selected optional extensions.

---

# Core Features Supported

- Form Builder
- Form Management (CRUD)
- Publish / Unpublish Forms
- Shareable Public Forms
- Multiple Question Types
- One-to-One & One-to-Many Relationships
- Response Collection
- Response Analytics
- Drag-and-Drop Question Ordering

---

# Bonus Features Supported

- Conditional Logic (Logic Jumps)
- Custom Themes
- Dark Mode
- CSV Export
- Partial Response Tracking
- File Upload Question Type

---

# Entity Relationship Diagram

```text
                 +-------------+
                 |    forms    |
                 +-------------+
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
+----------------+            +----------------+
|   questions    |            |   responses    |
+----------------+            +----------------+
        │                             │
        ▼                             ▼
+------------------+          +----------------+
| question_options |          |    answers     |
+------------------+          +----------------+
        │
        ▼
+----------------+
|  logic_rules   |
+----------------+
```

---

# Database Tables

## 1. forms

Stores metadata for every form created by the creator.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Unique form identifier |
| title | TEXT | Form title |
| description | TEXT | Optional description |
| status | TEXT | `draft` or `published` |
| share_id | TEXT (UNIQUE) | Public share identifier |
| theme_color | TEXT | Theme accent colour |
| background_color | TEXT | Background colour |
| font_family | TEXT | Selected font |
| dark_mode | BOOLEAN | Dark mode enabled |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last modification timestamp |

---

## 2. questions

Stores every question belonging to a form.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Unique question identifier |
| form_id | INTEGER (FK) | Parent form |
| title | TEXT | Question title |
| description | TEXT | Optional help text |
| type | TEXT | Question type |
| required | BOOLEAN | Required flag |
| position | INTEGER | Question order |
| allow_multiple_files | BOOLEAN | Enables multiple uploads (Bonus) |

### Supported Question Types

- Short Text
- Long Text
- Email
- Number
- Date
- Yes / No
- Multiple Choice
- Dropdown
- Rating
- File Upload *(Bonus)*

---

## 3. question_options

Stores selectable options for questions that require predefined choices.

Applicable Question Types:

- Multiple Choice
- Dropdown
- Rating (if implemented)

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Option identifier |
| question_id | INTEGER (FK) | Parent question |
| option_text | TEXT | Option label |
| position | INTEGER | Display order |

---

## 4. logic_rules *(Bonus)*

Supports conditional branching between questions.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Rule identifier |
| question_id | INTEGER (FK) | Source question |
| option_id | INTEGER (FK) | Trigger option |
| target_question_id | INTEGER (FK) | Destination question |

### Example

```
Question:
Do you own a car?

↓

Selected Option:
Yes

↓

Jump To:
Car Details
```

---

## 5. responses

Stores every submitted response for a form.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Response identifier |
| form_id | INTEGER (FK) | Parent form |
| completed | BOOLEAN | Completion status |
| progress_percentage | INTEGER | Progress (Bonus) |
| started_at | DATETIME | Response start time |
| submitted_at | DATETIME | Submission timestamp |

Used for:

- Response History
- Completion Statistics
- Partial Responses *(Bonus)*

---

## 6. answers

Stores the answer for every question within a response.

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Answer identifier |
| response_id | INTEGER (FK) | Parent response |
| question_id | INTEGER (FK) | Parent question |
| answer_value | TEXT | User answer |
| file_path | TEXT | Uploaded file location *(Bonus)* |

### Example Values

**Short Text**

```
Puneet Kumar
```

**Email**

```
puneet@example.com
```

**Rating**

```
5
```

**Yes / No**

```
true
```

**File Upload**

```
uploads/resume.pdf
```

---

# Relationships

## Form → Questions

```
One Form
    │
    ▼
Many Questions
```

---

## Question → Question Options

```
One Question
      │
      ▼
Many Options
```

---

## Form → Responses

```
One Form
      │
      ▼
Many Responses
```

---

## Response → Answers

```
One Response
      │
      ▼
Many Answers
```

---

## Question → Logic Rules

```
One Question
      │
      ▼
Many Logic Rules
```

---

# Schema Design Decisions

### Normalized Database Design

The schema is normalized to reduce redundancy and maintain data consistency.

### Flexible Answer Storage

A generic `answer_value` column is used to support multiple primitive question types without requiring separate tables.

### Separate Options Table

Question options are stored independently, allowing unlimited choices while avoiding array-based storage.

### Ordered Questions

The `position` column enables drag-and-drop ordering within the builder.

### Public Sharing

Each published form receives a unique `share_id`, allowing anonymous respondents to access forms without authentication.

### Conditional Logic

Logic rules are isolated into a dedicated table, making branching extensible and maintainable.

### Theme Support

Visual customization is stored at the form level, allowing each form to maintain independent styling.

### Partial Responses

Progress tracking is stored within the `responses` table, making resume functionality straightforward to implement.

### File Uploads

Uploaded file paths are stored alongside normal answers, avoiding unnecessary additional tables.

---

# Tables Summary

| Table | Purpose |
|---------|---------|
| forms | Stores form metadata and publishing information |
| questions | Stores questions belonging to a form |
| question_options | Stores selectable options |
| logic_rules | Stores conditional branching rules |
| responses | Stores submitted responses |
| answers | Stores individual answers |

---

# Summary

- **Database:** SQLite
- **Total Tables:** 6
- **Relationships:** One-to-Many
- **ORM:** SQLAlchemy 2.0
- **Migration Tool:** Alembic
- **Normalization:** Third Normal Form (3NF)

This schema provides a scalable foundation for the Typeform Clone while remaining simple enough for local development and future feature expansion.