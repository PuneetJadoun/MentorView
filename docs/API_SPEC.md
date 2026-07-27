# API Specification

## Overview

This document describes the REST API for the **Typeform Clone** built with **FastAPI**.

The API enables creators to manage forms, build questionnaires, publish forms through shareable links, collect responses, and view submissions.

**Content-Type**

```
application/json
```

---

# Base URL

Development

```
http://localhost:8000
```

Production

```
https://your-backend-url
```

---

# Authentication

Authentication is intentionally simplified for this assignment.

- Creator endpoints assume a default logged-in creator.
- Published forms can be filled without authentication.

---

# Forms API

## Create Form

**POST** `/forms`

### Request

```json
{
  "title": "Customer Feedback",
  "description": "Help us improve our service."
}
```

### Response

```json
{
  "id": 1,
  "share_id": "abc123xyz",
  "title": "Customer Feedback",
  "status": "draft"
}
```

---

## Get All Forms

**GET** `/forms`

Returns all forms.

---

## Get Form

**GET** `/forms/{form_id}`

Returns complete information for a single form.

---

## Update Form

**PUT** `/forms/{form_id}`

Updates the form title or description.

---

## Delete Form

**DELETE** `/forms/{form_id}`

Deletes the form and all related questions, options and responses.

---

## Publish Form

**POST** `/forms/{form_id}/publish`

Publishes the form and generates a shareable link.

Example response

```json
{
  "share_url": "https://your-domain.com/form/abc123xyz"
}
```

---

## Unpublish Form

**POST** `/forms/{form_id}/unpublish`

Returns the form to Draft mode.

---

# Questions API

## Create Question

**POST** `/forms/{form_id}/questions`

Creates a question inside a form.

Supported question types

- Short Text
- Long Text
- Email
- Number
- Date
- Yes / No
- Multiple Choice
- Dropdown
- Rating

Example

```json
{
  "title": "What is your name?",
  "type": "SHORT_TEXT",
  "required": true,
  "position": 1
}
```

---

## Get Questions

**GET** `/forms/{form_id}/questions`

Returns all questions ordered by position.

---

## Update Question

**PUT** `/questions/{question_id}`

Updates any editable question field.

---

## Delete Question

**DELETE** `/questions/{question_id}`

Deletes a question.

---

## Reorder Questions

**PATCH** `/forms/{form_id}/questions/reorder`

Updates the ordering of questions.

---

# Question Options API

## Add Option

**POST** `/questions/{question_id}/options`

Creates an option for Multiple Choice, Dropdown or Rating questions.

---

## Update Option

**PUT** `/options/{option_id}`

Updates option text.

---

## Delete Option

**DELETE** `/options/{option_id}`

Deletes an option.

---

# Public Form API

## Get Published Form

**GET** `/public/{share_id}`

Loads a published form for respondents.

Returns

- Form title
- Description
- Ordered questions
- Question options

---

## Submit Response

**POST** `/public/{share_id}/submit`

Stores a completed response.

Example

```json
{
  "answers": [
    {
      "question_id": 1,
      "answer": "John Doe"
    }
  ]
}
```

---

# Responses API

## Get Form Responses

**GET** `/forms/{form_id}/responses`

Returns all submitted responses for a form.

---

## Get Response Details

**GET** `/responses/{response_id}`

Returns every answer belonging to a response.

---

## Export CSV *(Bonus)*

**GET** `/forms/{form_id}/responses/export`

Downloads all responses as a CSV file.

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
|200|Success|
|201|Resource Created|
|204|Resource Deleted|
|400|Bad Request|
|404|Resource Not Found|
|422|Validation Error|
|500|Internal Server Error|

---

# Validation Rules

## Forms

- Title is required
- Description is optional

---

## Questions

- Question title cannot be empty
- Position must be unique within a form
- Supported question types only

---

## Responses

- Required questions must be answered
- Email fields require a valid email address
- Number questions accept numeric values only

---

# API Design

The backend follows a layered architecture.

```
Client
    │
    ▼
FastAPI Router
    │
    ▼
Service Layer
    │
    ▼
Repository Layer
    │
    ▼
SQLAlchemy ORM
    │
    ▼
SQLite Database
```

---

# Interactive API Documentation

FastAPI automatically generates Swagger documentation.

Development

```
http://localhost:8000/docs
```

Production

```
https://your-backend-url/docs
```

---

# API Summary

| Method | Endpoint | Description |
|---------|----------|-------------|
|POST|`/forms`|Create form|
|GET|`/forms`|List forms|
|GET|`/forms/{id}`|Get form|
|PUT|`/forms/{id}`|Update form|
|DELETE|`/forms/{id}`|Delete form|
|POST|`/forms/{id}/publish`|Publish form|
|POST|`/forms/{id}/unpublish`|Unpublish form|
|POST|`/forms/{id}/questions`|Create question|
|GET|`/forms/{id}/questions`|List questions|
|PUT|`/questions/{id}`|Update question|
|DELETE|`/questions/{id}`|Delete question|
|PATCH|`/forms/{id}/questions/reorder`|Reorder questions|
|POST|`/questions/{id}/options`|Create option|
|PUT|`/options/{id}`|Update option|
|DELETE|`/options/{id}`|Delete option|
|GET|`/public/{share_id}`|Load public form|
|POST|`/public/{share_id}/submit`|Submit response|
|GET|`/forms/{id}/responses`|List responses|
|GET|`/responses/{id}`|View response|
|GET|`/forms/{id}/responses/export`|Export CSV *(Bonus)*|

---

## Notes

- RESTful API design
- JSON request/response format
- SQLite persistence using SQLAlchemy
- Interactive Swagger documentation available at `/docs`
- Clean separation of Router → Service → Repository → Database layers