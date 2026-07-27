from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.question import (
    QuestionCreate,
    QuestionOptionCreate,
    QuestionOptionResponse,
    QuestionOptionUpdate,
    QuestionReorderItem,
    QuestionResponse,
    QuestionUpdate,
)
from app.services import question_service

router = APIRouter()


@router.post(
    "/forms/{form_id}/questions",
    response_model=QuestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a question to a form",
    tags=["Questions"],
    description=(
        "Creates a new question on the given form. If position is omitted, "
        "the question is appended to the end of the form."
    ),
)
def create_question(
    form_id: int, question_data: QuestionCreate, db: Session = Depends(get_db)
) -> QuestionResponse:
    return question_service.create_question(db, form_id, question_data)


@router.get(
    "/forms/{form_id}/questions",
    response_model=list[QuestionResponse],
    status_code=status.HTTP_200_OK,
    summary="List questions for a form",
    tags=["Questions"],
    description="Returns every question on the form, ordered by position, for the builder view.",
)
def list_questions(form_id: int, db: Session = Depends(get_db)) -> list[QuestionResponse]:
    return question_service.list_questions(db, form_id)


@router.get(
    "/questions/{question_id}",
    response_model=QuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single question",
    tags=["Questions"],
    description="Returns full details for one question, including its options if any.",
)
def get_question(question_id: int, db: Session = Depends(get_db)) -> QuestionResponse:
    return question_service.get_question(db, question_id)


@router.put(
    "/questions/{question_id}",
    response_model=QuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a question",
    tags=["Questions"],
    description="Updates a question's title, description, type, and/or required flag.",
)
def update_question(
    question_id: int, update_data: QuestionUpdate, db: Session = Depends(get_db)
) -> QuestionResponse:
    return question_service.update_question(db, question_id, update_data)


@router.delete(
    "/questions/{question_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a question",
    tags=["Questions"],
    description="Permanently deletes a question and, via cascade, its options, logic rules, and answers.",
)
def delete_question(question_id: int, db: Session = Depends(get_db)) -> None:
    question_service.delete_question(db, question_id)


@router.patch(
    "/forms/{form_id}/questions/reorder",
    response_model=list[QuestionResponse],
    status_code=status.HTTP_200_OK,
    summary="Reorder questions",
    tags=["Questions"],
    description="Bulk-updates the position of multiple questions on a form in a single request.",
)
def reorder_questions(
    form_id: int, items: list[QuestionReorderItem], db: Session = Depends(get_db)
) -> list[QuestionResponse]:
    return question_service.reorder_questions(db, form_id, items)


@router.post(
    "/questions/{question_id}/options",
    response_model=QuestionOptionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add an option to a question",
    description="Adds a selectable option to a multiple_choice, checkbox, or dropdown question.",
    tags=["Question Options"],
)
def create_option(
    question_id: int, option_data: QuestionOptionCreate, db: Session = Depends(get_db)
) -> QuestionOptionResponse:
    return question_service.create_option(db, question_id, option_data)


@router.put(
    "/options/{option_id}",
    response_model=QuestionOptionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an option",
    description="Updates an option's label.",
    tags=["Question Options"],
)
def update_option(
    option_id: int, option_data: QuestionOptionUpdate, db: Session = Depends(get_db)
) -> QuestionOptionResponse:
    return question_service.update_option(db, option_id, option_data)


@router.delete(
    "/options/{option_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an option",
    description="Permanently deletes an option.",
    tags=["Question Options"],
)
def delete_option(option_id: int, db: Session = Depends(get_db)) -> None:
    question_service.delete_option(db, option_id)
