# Typeform Clone

A full-stack clone of **Typeform** that recreates its intuitive form-building experience and conversational one-question-at-a-time form filling workflow.

Built as part of the **Scaler SDE Full Stack Assignment**, this project enables users to create interactive forms, publish them through shareable links, collect responses, and analyze submissions through a clean and modern dashboard inspired by Typeform.

---

## Table of Contents

- Overview
- Key Features
- Screenshots
- Technology Stack
- System Architecture
- Database Design
- API Documentation
- Project Structure
- Installation
- Usage
- Business Logic
- AI Usage
- Future Improvements
- Author
- License

---

# Overview

Modern online forms have evolved beyond traditional static questionnaires. Platforms like Typeform provide a conversational experience that guides respondents through one question at a time, resulting in higher engagement and completion rates.

This project recreates the core experience of Typeform using a modern full-stack architecture while maintaining a clean, responsive interface and scalable backend.

The application provides two primary workflows:

### Form Creator

Creators can

- Create forms
- Edit form settings
- Add multiple question types
- Reorder questions
- Publish forms
- Share public links
- Preview forms
- View collected responses
- Export responses as CSV

### Respondent

Respondents can

- Open a shared form
- Complete questions one at a time
- Navigate using keyboard shortcuts
- View progress
- Submit responses
- Receive a completion confirmation screen

---

# Problem Statement

Traditional survey applications often present long pages filled with multiple questions, resulting in poor user experience and lower completion rates.

This project addresses those limitations by providing:

- Conversational form filling
- Intuitive drag-and-drop form builder
- Real-time publishing
- Shareable public forms
- Response analytics
- Modern responsive UI

---

# Solution

The application consists of two major components:

### Creator Dashboard

Provides tools to create, edit, organize, publish, and manage forms.

### Public Form Experience

Provides a distraction-free conversational interface where users answer one question at a time.

A FastAPI backend exposes REST APIs while SQLite stores all application data through SQLAlchemy ORM.

---

# Key Features

## Form Builder

- Create new forms
- Edit existing forms
- Delete forms
- Draft & Published states
- Shareable public links
- Live preview
- Drag-and-drop question ordering
- Theme customization
- Form settings page

---

## Supported Question Types

- Short Text
- Long Text
- Email
- Number
- Date
- Yes / No
- Multiple Choice
- Dropdown
- Rating

---

## Conversational Form Experience

- One question at a time
- Keyboard navigation
- Enter key support
- Progress indicator
- Validation
- Animated transitions
- Thank You screen

---

## Response Dashboard

- View submitted responses
- Completion statistics
- Completion rate
- Recent responses
- Response details
- Choice distribution charts
- Export responses as CSV

---

## UI Features

- Typeform-inspired design
- Responsive layout
- Dark Mode
- Smooth animations
- Toast notifications
- Loading states
- Empty states

---

# Screenshots

<img width="1919" height="907" alt="Screenshot 2026-07-27 142827" src="https://github.com/user-attachments/assets/3e40d356-7cb7-4ad4-bddd-81d34ea34dba" />




<img width="1919" height="901" alt="Screenshot 2026-07-27 142846" src="https://github.com/user-attachments/assets/592fb701-7632-45f6-bf38-3228d41593a9" />






<img width="1919" height="901" alt="Screenshot 2026-07-27 143010" src="https://github.com/user-attachments/assets/511f1646-dd74-4a3c-8606-4cba18741bb7" />








<img width="1916" height="910" alt="Screenshot 2026-07-27 143028" src="https://github.com/user-attachments/assets/5d5c9373-356e-421d-be08-734adf78ded7" />









<img width="1914" height="901" alt="Screenshot 2026-07-27 143410" src="https://github.com/user-attachments/assets/e1f84e02-3c4b-42cd-98c4-2bdccf75a533" />








<img width="1912" height="902" alt="Screenshot 2026-07-27 143427" src="https://github.com/user-attachments/assets/144ce5e0-8651-4d02-a746-41ba54bb641d" />











<img width="1917" height="904" alt="Screenshot 2026-07-27 143441" src="https://github.com/user-attachments/assets/e1267c29-c78f-4ee1-be0f-2d5c62019fbe" />









<img width="1915" height="904" alt="Screenshot 2026-07-27 143531" src="https://github.com/user-attachments/assets/2390c874-4817-4c4c-a5d5-133d4d9b4dcc" />













<img width="1915" height="911" alt="Screenshot 2026-07-27 143549" src="https://github.com/user-attachments/assets/8d7ec6ef-b558-4e1d-9a25-a136fd035434" />











<img width="1896" height="906" alt="Screenshot 2026-07-27 143612" src="https://github.com/user-attachments/assets/4a786439-f34c-49f5-bf60-0fa4816b38ff" />










<img width="1918" height="1021" alt="Screenshot 2026-07-27 143703" src="https://github.com/user-attachments/assets/b1356049-98ea-4c90-972d-f6c0f1d699dc" />











<img width="1919" height="900" alt="Screenshot 2026-07-27 143719" src="https://github.com/user-attachments/assets/b9f9b974-f2bd-4783-aff4-b4ea367dce0d" />











---

# Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Forms | React Hook Form |
| State Management | React Hooks |
| HTTP Client | Axios |
| Backend | FastAPI |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite |
| Migrations | Alembic |
| Validation | Pydantic |
| Icons | Lucide React |

---

# System Architecture

```
                    Next.js Frontend
                           │
                           │
                        Axios API
                           │
                           ▼
                    FastAPI REST API
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Service Layer       Validation Layer
                 │
                 ▼
          SQLAlchemy ORM
                 │
                 ▼
              SQLite
```

---

## Architecture Highlights

- RESTful API architecture
- Layered backend (Router → Service → Repository)
- SQLAlchemy ORM for database interaction
- Alembic for schema migrations
- Modular frontend component architecture
- Type-safe communication using Pydantic models
- Responsive design optimized for desktop and mobile

---

# Database Design

The application uses **SQLite** as the primary relational database and **SQLAlchemy ORM** for data access. The schema is normalized to minimize redundancy while supporting both required and bonus features.

## Entity Relationship Diagram

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

## Database Tables

| Table | Purpose |
|---------|---------|
| forms | Stores form metadata |
| questions | Stores questions for each form |
| question_options | Stores options for dropdown and multiple choice questions |
| responses | Stores submitted responses |
| answers | Stores answers for each response |
| logic_rules | Stores conditional branching rules (Bonus) |

---

## Database Features

- Normalized relational schema
- Foreign key relationships
- Ordered questions
- Public sharing using unique Share IDs
- Response analytics
- Theme configuration
- Partial response support
- Logic jump support
- File upload support

---

# API Documentation

The backend exposes a RESTful API built using **FastAPI**.

All requests and responses use JSON unless specified otherwise.

## Forms

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/forms` | Create form |
| GET | `/forms` | List forms |
| GET | `/forms/{id}` | Get form |
| PUT | `/forms/{id}` | Update form |
| DELETE | `/forms/{id}` | Delete form |
| POST | `/forms/{id}/publish` | Publish form |
| POST | `/forms/{id}/unpublish` | Unpublish form |

---

## Questions

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/forms/{id}/questions` | Add question |
| GET | `/forms/{id}/questions` | Get questions |
| PUT | `/questions/{id}` | Update question |
| DELETE | `/questions/{id}` | Delete question |
| PATCH | `/forms/{id}/questions/reorder` | Reorder questions |

---

## Question Options

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/questions/{id}/options` | Add option |
| PUT | `/options/{id}` | Update option |
| DELETE | `/options/{id}` | Delete option |

---

## Public Form

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/public/{share_id}` | Load published form |
| POST | `/public/{share_id}/submit` | Submit response |

---

## Responses

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/forms/{id}/responses` | List responses |
| GET | `/responses/{id}` | Response details |
| GET | `/forms/{id}/responses/export` | Export CSV |

---

## Interactive Documentation

FastAPI automatically generates Swagger documentation.

```
http://localhost:8000/docs
```

---

# Project Structure

```text
TypeformClone/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   ├── requirements.txt
│   └── alembic.ini
│
├── docs/
│   ├── API_SPEC.md
│   └── DATABASE_SCHEMA.md
│
└── README.md
```

---

# Business Logic

## Form Management

- Create, edit and delete forms
- Draft and published states
- Unique shareable URL for every published form
- Preview before publishing

---

## Question Management

- Add unlimited questions
- Drag-and-drop reordering
- Required field toggle
- Multiple supported question types
- Dynamic option management

---

## Form Filling

- Conversational one-question-at-a-time interface
- Keyboard navigation
- Required field validation
- Progress tracking
- Thank-you screen after submission

---

## Response Management

- Store every submission
- View individual responses
- Completion statistics
- Choice distribution
- Export responses as CSV

---

# Sample Seed Data

The project includes a demo form for testing and demonstration.

## Customer Feedback Survey

Description

> Help us improve our products and services by sharing your feedback.

### Sample Questions

1. What is your name?
2. What is your email?
3. Which product did you purchase?
4. Rate your experience (1–5)
5. Would you recommend us?

### Example Response

| Question | Answer |
|-----------|--------|
| Name | Puneet Kumar |
| Email | puneet@example.com |
| Product | Laptop |
| Rating | 5 |
| Recommend | Yes |

This sample data allows reviewers to immediately explore the form builder, conversational respondent flow, response dashboard, analytics, and CSV export functionality without creating a new form from scratch.

---

# Installation

## Prerequisites

- Node.js (v18 or later)
- Python (v3.11 or later)
- SQLite
- Git

---

## Clone Repository

```bash
git clone <repository-url>
cd typeform-clone
```

---

## Backend Setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS / Linux

pip install -r requirements.txt

# Apply database migrations
alembic upgrade head
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=sqlite:///./typeform.db
```

Create a `.env.local` file inside `frontend/` (or copy `.env.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Running the Project

Start the backend (from `backend/`, with the virtual environment activated):

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` and interactive docs at `http://localhost:8000/docs`.

Start the frontend (from `frontend/`, in a separate terminal):

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

# Usage

## Creator Workflow

1. Create a new form from the dashboard.
2. Configure the form title and description.
3. Add questions using the builder.
4. Reorder questions using drag and drop.
5. Mark questions as required if needed.
6. Preview the form.
7. Publish the form.
8. Copy the generated public link.
9. Share the link with respondents.
10. View submitted responses and analytics.
11. Export responses as CSV.

---

## Respondent Workflow

1. Open the shared form link.
2. Read the welcome screen.
3. Click **Start**.
4. Answer one question at a time.
5. Navigate using the keyboard or buttons.
6. Submit the completed form.
7. View the confirmation screen.

---

# Business Rules

- A form must have a title before it can be published.
- Published forms receive a unique shareable URL.
- Questions are displayed in the order defined by the creator.
- Required questions must be answered before moving forward.
- Responses are stored only after successful submission.
- Every submitted response is linked to its parent form.
- Choice-based questions display response distribution in analytics.
- CSV export includes all collected responses.

---

# Documentation

Additional documentation is available in the `docs` directory.

- `docs/API_SPEC.md`
- `docs/DATABASE_SCHEMA.md`

---

# AI Usage

AI-assisted development tools were used to accelerate implementation and improve development productivity.

### Tools Used

- Claude Code
- ChatGPT

AI was primarily used for:

- Architecture planning
- Database schema design
- API design
- UI implementation assistance
- Code generation
- Debugging
- Documentation
- Code review

All generated code was reviewed, tested, modified, and integrated manually before being included in the final project.

---

# Future Improvements

The following enhancements can be added in future iterations:

- User Authentication
- Workspace & Team Collaboration
- Form Templates
- Image Questions
- Rich Text Editor
- File Upload Support
- Conditional Logic Builder UI
- Response Filtering
- Email Notifications
- Autosave Draft Responses
- Analytics Dashboard
- Form Embedding
- Webhook Integrations
- Theme Marketplace
- Custom Domains
- Multi-language Support

---

# Challenges Faced

During development, several challenges were encountered:

- Designing a scalable relational database schema.
- Implementing drag-and-drop question ordering.
- Creating a conversational one-question-at-a-time experience.
- Managing frontend and backend state synchronization.
- Designing reusable components.
- Handling response analytics efficiently.
- Maintaining a Typeform-inspired user experience while keeping the implementation original.

---

# Learnings

This project provided hands-on experience with:

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hooks
- Component Architecture
- State Management

### Backend

- FastAPI
- SQLAlchemy ORM
- Alembic Migrations
- Pydantic Validation
- REST API Design
- Repository & Service Pattern

### Database

- SQLite
- Relational Database Design
- Foreign Keys
- Database Normalization
- ORM Relationships

### Software Engineering

- Layered Architecture
- Modular Project Structure
- API Documentation
- Database Documentation
- Git Version Control
- Full Stack Development Workflow

---

# Acknowledgements

This project was developed as part of the **Scaler SDE Full Stack Assignment**.

The application is inspired by the user experience and interaction design of **Typeform**, while being independently implemented using modern web technologies.

---

# Author

**Puneet Kumar**

GitHub: **https://github.com/<your-username>**

LinkedIn: **https://linkedin.com/in/<your-profile>**

---

# License

This project was developed for educational and demonstration purposes as part of the Scaler SDE Full Stack Assignment.

It is not affiliated with or endorsed by Typeform.

---

# Project Status

✅ Full Stack Application

✅ REST API

✅ SQLite Database

✅ Form Builder

✅ Conversational Form Experience

✅ Response Analytics

✅ CSV Export

✅ Dark Mode

✅ Responsive UI

---

## Thank You

Thank you for taking the time to review this project.

Feedback and suggestions are always welcome.
