from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.form import FormCreate, FormListResponse, FormResponse, FormUpdate
from app.services import form_service

router = APIRouter(tags=["Forms"])


@router.post(
    "",
    response_model=FormResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new form",
    description=(
        "Creates a new draft form with a title and optional description. "
        "A unique share_id is generated automatically."
    ),
)
def create_form(form_data: FormCreate, db: Session = Depends(get_db)) -> FormResponse:
    return form_service.create_form(db, form_data)


@router.get(
    "",
    response_model=list[FormListResponse],
    status_code=status.HTTP_200_OK,
    summary="List all forms",
    description="Returns a paginated list of the creator's forms for the forms list/dashboard view.",
)
def list_forms(
    skip: int = Query(default=0, ge=0, description="Number of forms to skip."),
    limit: int = Query(default=20, ge=1, le=100, description="Maximum number of forms to return."),
    db: Session = Depends(get_db),
) -> list[FormListResponse]:
    return form_service.list_forms(db, skip=skip, limit=limit)


@router.get(
    "/{form_id}",
    response_model=FormResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single form",
    description="Returns full details for one form by id.",
)
def get_form(form_id: int, db: Session = Depends(get_db)) -> FormResponse:
    return form_service.get_form(db, form_id)


@router.put(
    "/{form_id}",
    response_model=FormResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a form",
    description="Updates a form's title and/or description.",
)
def update_form(
    form_id: int, update_data: FormUpdate, db: Session = Depends(get_db)
) -> FormResponse:
    return form_service.update_form(db, form_id, update_data)


@router.delete(
    "/{form_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a form",
    description=(
        "Permanently deletes a form and, via cascade, its questions, options, "
        "logic rules, responses, and answers."
    ),
)
def delete_form(form_id: int, db: Session = Depends(get_db)) -> None:
    form_service.delete_form(db, form_id)


@router.post(
    "/{form_id}/publish",
    response_model=FormResponse,
    status_code=status.HTTP_200_OK,
    summary="Publish a form",
    description="Marks a form as published and ensures it has a share_id, making it publicly fillable.",
)
def publish_form(form_id: int, db: Session = Depends(get_db)) -> FormResponse:
    return form_service.publish_form(db, form_id)


@router.post(
    "/{form_id}/unpublish",
    response_model=FormResponse,
    status_code=status.HTTP_200_OK,
    summary="Unpublish a form",
    description="Reverts a published form back to draft status. The share_id is kept.",
)
def unpublish_form(form_id: int, db: Session = Depends(get_db)) -> FormResponse:
    return form_service.unpublish_form(db, form_id)
