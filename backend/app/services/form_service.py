from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.form import Form
from app.schemas.form import FormCreate, FormUpdate
from app.services import form_repository
from app.services.form_repository import _generate_share_id


def create_form(db: Session, form_data: FormCreate) -> Form:
    if not form_data.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Form title cannot be empty.",
        )
    return form_repository.create_form(db, form_data)


def get_form(db: Session, form_id: int) -> Form:
    form = form_repository.get_form_by_id(db, form_id)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found.",
        )
    return form


def list_forms(db: Session, skip: int = 0, limit: int = 20) -> list[Form]:
    return form_repository.get_all_forms(db, skip=skip, limit=limit)


def update_form(db: Session, form_id: int, update_data: FormUpdate) -> Form:
    if update_data.title is not None and not update_data.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Form title cannot be empty.",
        )

    form = form_repository.update_form(db, form_id, update_data)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found.",
        )
    return form


def delete_form(db: Session, form_id: int) -> Form:
    form = form_repository.delete_form(db, form_id)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found.",
        )
    return form


def publish_form(db: Session, form_id: int) -> Form:
    form = form_repository.get_form_by_id(db, form_id)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found.",
        )

    if not form.share_id:
        form.share_id = _generate_share_id()
    form.status = "published"

    db.commit()
    db.refresh(form)
    return form


def unpublish_form(db: Session, form_id: int) -> Form:
    form = form_repository.get_form_by_id(db, form_id)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found.",
        )

    form.status = "draft"

    db.commit()
    db.refresh(form)
    return form
