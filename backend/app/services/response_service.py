import csv
import io

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.response import AnswerDetail, ResponseDetail, ResponseListItem
from app.services import answer_repository, form_repository, question_repository, response_repository


def _get_form_or_404(db: Session, form_id: int):
    form = form_repository.get_form_by_id(db, form_id)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Form not found."
        )
    return form


def list_responses_for_form(db: Session, form_id: int) -> list[ResponseListItem]:
    _get_form_or_404(db, form_id)
    responses = response_repository.get_responses_by_form(db, form_id)
    return [
        ResponseListItem(
            response_id=r.id, submitted_at=r.submitted_at, completed=r.completed
        )
        for r in responses
    ]


def get_response_detail(db: Session, response_id: int) -> ResponseDetail:
    response = response_repository.get_response_by_id(db, response_id)
    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Response not found."
        )

    answers = answer_repository.get_answers_by_response(db, response.id)
    return ResponseDetail(
        response_id=response.id,
        submitted_at=response.submitted_at,
        completed=response.completed,
        answers=[
            AnswerDetail(question=a.question.title, answer=a.answer_value) for a in answers
        ],
    )


def export_responses_csv(db: Session, form_id: int) -> str:
    _get_form_or_404(db, form_id)
    questions = question_repository.get_questions_by_form(db, form_id)
    responses = response_repository.get_responses_by_form(db, form_id)

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(
        ["response_id", "submitted_at", "completed"] + [q.title for q in questions]
    )

    for response in responses:
        answers = answer_repository.get_answers_by_response(db, response.id)
        answers_by_question_id = {a.question_id: a.answer_value for a in answers}
        row = [
            response.id,
            response.submitted_at.isoformat() if response.submitted_at else "",
            response.completed,
        ]
        row += [answers_by_question_id.get(q.id) or "" for q in questions]
        writer.writerow(row)

    return buffer.getvalue()
