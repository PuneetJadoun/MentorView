# API Spec

> Placeholder — to be filled in with: REST endpoint list (forms, questions, responses), request/response payloads, status codes, and validation rules.


# API Specification

## Overview

This document defines the REST API contract for the **Typeform Clone**.

**Base URL**

```
/api
```

All requests and responses use **JSON** unless otherwise specified.

---

# Forms

## Create Form

**POST** `/forms`

### Request

```json
{
  "title": "Untitled Form",
  "description": "Sample description"
}
```

### Response

```json
{
  "id": 1,
  "share_id": "abc123xyz",
  "message": "Form created successfully"
}
```

---

## Get All Forms

**GET** `/forms`

### Response

```json
[
  {
    "id": 1,
    "title": "Customer Feedback",
    "status": "draft",
    "updated_at": "2026-07-27T10:00:00Z"
  }
]
```

---

## Get Form

**GET** `/forms/{form_id}`

### Response

```json
{
  "id": 1,
  "title": "Customer Feedback",
  "description": "Survey",
  "status": "draft",
  "share_id": "abc123xyz"
}
```

---

## Update Form

**PUT** `/forms/{form_id}`

### Request

```json
{
  "title": "Updated Title",
  "description": "Updated Description"
}
```

### Response

```json
{
  "message": "Form updated successfully"
}
```

---

## Delete Form

**DELETE** `/forms/{form_id}`

### Response

```json
{
  "message": "Form deleted successfully"
}
```

---

## Publish Form

**POST** `/forms/{form_id}/publish`

### Response

```json
{
  "share_url": "https://your-domain.com/f/abc123xyz"
}
```

---

## Unpublish Form

**POST** `/forms/{form_id}/unpublish`

### Response

```json
{
  "message": "Form unpublished successfully"
}
```

---

# Questions

## Add Question

**POST** `/forms/{form_id}/questions`

### Request

```json
{
  "title": "What is your name?",
  "description": "",
  "type": "SHORT_TEXT",
  "required": true,
  "position": 1
}
```

### Response

```json
{
  "id": 10,
  "message": "Question added successfully"
}
```

---

## Update Question

**PUT** `/questions/{question_id}`

### Request

```json
{
  "title": "Updated Question",
  "required": false
}
```

### Response

```json
{
  "message": "Question updated successfully"
}
```

---

## Delete Question

**DELETE** `/questions/{question_id}`

### Response

```json
{
  "message": "Question deleted successfully"
}
```

---

## Reorder Questions

**PATCH** `/forms/{form_id}/questions/reorder`

### Request

```json
[
  {
    "question_id": 3,
    "position": 1
  },
  {
    "question_id": 1,
    "position": 2
  }
]
```

### Response

```json
{
  "message": "Questions reordered successfully"
}
```

---

# Question Options

## Add Option

**POST** `/questions/{question_id}/options`

### Request

```json
{
  "option_text": "Python"
}
```

### Response

```json
{
  "id": 5,
  "message": "Option added successfully"
}
```

---

## Update Option

**PUT** `/options/{option_id}`

### Request

```json
{
  "option_text": "Java"
}
```

### Response

```json
{
  "message": "Option updated successfully"
}
```

---

## Delete Option

**DELETE** `/options/{option_id}`

### Response

```json
{
  "message": "Option deleted successfully"
}
```

---

# Logic Rules (Bonus)

## Create Logic Rule

**POST** `/questions/{question_id}/logic`

### Request

```json
{
  "option_id": 3,
  "target_question_id": 8
}
```

### Response

```json
{
  "message": "Logic rule created successfully"
}
```

---

## Update Logic Rule

**PUT** `/logic/{logic_id}`

### Request

```json
{
  "target_question_id": 10
}
```

### Response

```json
{
  "message": "Logic rule updated successfully"
}
```

---

## Delete Logic Rule

**DELETE** `/logic/{logic_id}`

### Response

```json
{
  "message": "Logic rule deleted successfully"
}
```

---

# Themes (Bonus)

## Update Theme

**PUT** `/forms/{form_id}/theme`

### Request

```json
{
  "theme_color": "#2563EB",
  "background_color": "#FFFFFF",
  "font_family": "Inter",
  "dark_mode": true
}
```

### Response

```json
{
  "message": "Theme updated successfully"
}
```

---

# Public Form

## Get Public Form

**GET** `/public/{share_id}`

### Response

```json
{
  "id": 1,
  "title": "Customer Feedback",
  "questions": []
}
```

---

## Submit Form

**POST** `/public/{share_id}/submit`

### Request

```json
{
  "answers": [
    {
      "question_id": 1,
      "answer": "John Doe"
    },
    {
      "question_id": 2,
      "answer": "Yes"
    }
  ]
}
```

### Response

```json
{
  "response_id": 12,
  "message": "Response submitted successfully"
}
```

---

## Save Partial Response (Bonus)

**POST** `/public/{share_id}/save`

### Request

```json
{
  "answers": [
    {
      "question_id": 1,
      "answer": "John"
    }
  ],
  "progress_percentage": 35
}
```

### Response

```json
{
  "response_id": 12,
  "message": "Progress saved successfully"
}
```

---

# Responses

## Get All Responses

**GET** `/forms/{form_id}/responses`

### Response

```json
[
  {
    "response_id": 1,
    "submitted_at": "2026-07-27T10:30:00Z",
    "completed": true
  }
]
```

---

## Get Single Response

**GET** `/responses/{response_id}`

### Response

```json
{
  "response_id": 1,
  "answers": [
    {
      "question": "Name",
      "answer": "John Doe"
    }
  ]
}
```

---

## Export Responses as CSV (Bonus)

**GET** `/forms/{form_id}/responses/export`

### Response

Returns a downloadable CSV file.

---

# File Upload (Bonus)

## Upload File

**POST** `/upload`

### Content-Type

```
multipart/form-data
```

### Request

```
file=<binary file>
```

### Response

```json
{
  "file_path": "/uploads/resume.pdf"
}
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 404 | Resource Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# API Summary

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/forms` | Create form |
| GET | `/forms` | Get all forms |
| GET | `/forms/{id}` | Get single form |
| PUT | `/forms/{id}` | Update form |
| DELETE | `/forms/{id}` | Delete form |
| POST | `/forms/{id}/publish` | Publish form |
| POST | `/forms/{id}/unpublish` | Unpublish form |
| POST | `/forms/{id}/questions` | Add question |
| PUT | `/questions/{id}` | Update question |
| DELETE | `/questions/{id}` | Delete question |
| PATCH | `/forms/{id}/questions/reorder` | Reorder questions |
| POST | `/questions/{id}/options` | Add option |
| PUT | `/options/{id}` | Update option |
| DELETE | `/options/{id}` | Delete option |
| POST | `/questions/{id}/logic` | Create logic rule |
| PUT | `/logic/{id}` | Update logic rule |
| DELETE | `/logic/{id}` | Delete logic rule |
| PUT | `/forms/{id}/theme` | Update theme |
| GET | `/public/{share_id}` | Load public form |
| POST | `/public/{share_id}/submit` | Submit response |
| POST | `/public/{share_id}/save` | Save partial response |
| GET | `/forms/{id}/responses` | Get responses |
| GET | `/responses/{id}` | Get single response |
| GET | `/forms/{id}/responses/export` | Export CSV |
| POST | `/upload` | Upload file |