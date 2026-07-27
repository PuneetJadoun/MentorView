from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.question_option import QuestionOption
from app.schemas.question import (
    QuestionCreate,
    QuestionOptionCreate,
    QuestionOptionUpdate,
    QuestionReorderItem,
    QuestionUpdate,
)
from app.services import form_repository, question_option_repository, question_repository

OPTION_BASED_TYPES = {"multiple_choice", "checkbox", "dropdown"}


def _get_form_or_404(db: Session, form_id: int):
    form = form_repository.get_form_by_id(db, form_id)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Form not found."
        )
    return form


def create_question(db: Session, form_id: int, question_data: QuestionCreate) -> Question:
    _get_form_or_404(db, form_id)
    return question_repository.create_question(db, form_id, question_data)


def get_question(db: Session, question_id: int) -> Question:
    question = question_repository.get_question_by_id(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found."
        )
    return question


def list_questions(db: Session, form_id: int) -> list[Question]:
    _get_form_or_404(db, form_id)
    return question_repository.get_questions_by_form(db, form_id)


def update_question(db: Session, question_id: int, update_data: QuestionUpdate) -> Question:
    question = question_repository.update_question(db, question_id, update_data)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found."
        )
    return question


def delete_question(db: Session, question_id: int) -> Question:
    question = question_repository.delete_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found."
        )
    return question


def reorder_questions(
    db: Session, form_id: int, items: list[QuestionReorderItem]
) -> list[Question]:
    _get_form_or_404(db, form_id)

    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one question must be provided to reorder.",
        )

    existing_ids = {q.id for q in question_repository.get_questions_by_form(db, form_id)}
    for item in items:
        if item.question_id not in existing_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question {item.question_id} does not belong to form {form_id}.",
            )

    return question_repository.reorder_questions(db, form_id, items)


def create_option(
    db: Session, question_id: int, option_data: QuestionOptionCreate
) -> QuestionOption:
    question = question_repository.get_question_by_id(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found."
        )

    if question.type not in OPTION_BASED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Options are only supported for {sorted(OPTION_BASED_TYPES)} "
                f"questions, not '{question.type}'."
            ),
        )

    return question_option_repository.create_option(db, question_id, option_data)


def update_option(
    db: Session, option_id: int, option_data: QuestionOptionUpdate
) -> QuestionOption:
    option = question_option_repository.update_option(db, option_id, option_data)
    if option is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Option not found."
        )
    return option


def delete_option(db: Session, option_id: int) -> QuestionOption:
    option = question_option_repository.delete_option(db, option_id)
    if option is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Option not found."
        )
    return option
