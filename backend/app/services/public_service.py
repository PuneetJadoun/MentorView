from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.question import Question
from app.schemas.public import (
    PublicFormResponse,
    PublicOptionResponse,
    PublicQuestionResponse,
    PublicSubmitRequest,
    PublicSubmitResponse,
)
from app.services import answer_repository, form_repository, question_repository, response_repository


def _get_published_form_or_404(db: Session, share_id: str):
    form = form_repository.get_form_by_share_id(db, share_id)
    if form is None or form.status != "published":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Form not found."
        )
    return form


def _build_public_question(question: Question) -> PublicQuestionResponse:
    # question.options isn't guaranteed ordered at the relationship level,
    # so sort explicitly rather than trust insertion order.
    ordered_options = sorted(question.options, key=lambda option: option.position)
    return PublicQuestionResponse(
        id=question.id,
        title=question.title,
        description=question.description,
        type=question.type,
        required=question.required,
        position=question.position,
        options=[PublicOptionResponse.model_validate(o) for o in ordered_options],
    )


def get_public_form(db: Session, share_id: str) -> PublicFormResponse:
    form = _get_published_form_or_404(db, share_id)
    questions = question_repository.get_questions_by_form(db, form.id)

    return PublicFormResponse(
        id=form.id,
        title=form.title,
        description=form.description,
        theme_color=form.theme_color,
        background_color=form.background_color,
        font_family=form.font_family,
        dark_mode=form.dark_mode,
        questions=[_build_public_question(q) for q in questions],
    )


def submit_response(
    db: Session, share_id: str, submit_data: PublicSubmitRequest
) -> PublicSubmitResponse:
    form = _get_published_form_or_404(db, share_id)
    questions = question_repository.get_questions_by_form(db, form.id)
    questions_by_id = {q.id: q for q in questions}

    answers_by_question_id: dict[int, str] = {}
    for item in submit_data.answers:
        if item.question_id not in questions_by_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question {item.question_id} does not belong to this form.",
            )
        answers_by_question_id[item.question_id] = item.answer

    for question in questions:
        if question.required:
            answer_text = answers_by_question_id.get(question.id, "")
            if not answer_text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Question '{question.title}' is required.",
                )

    response = response_repository.create_response(db, form.id)
    answer_repository.create_answers_bulk(
        db, response.id, list(answers_by_question_id.items())
    )

    return PublicSubmitResponse(
        response_id=response.id, message="Response submitted successfully"
    )
