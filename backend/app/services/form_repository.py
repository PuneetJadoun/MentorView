import secrets

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.form import Form
from app.schemas.form import FormCreate, FormUpdate


def _generate_share_id(length: int = 10) -> str:
    return secrets.token_urlsafe(length)[:length]


def create_form(db: Session, form_data: FormCreate) -> Form:
    form = Form(
        title=form_data.title,
        description=form_data.description,
        share_id=_generate_share_id(),
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


def get_form_by_id(db: Session, form_id: int) -> Form | None:
    return db.get(Form, form_id)


def get_form_by_share_id(db: Session, share_id: str) -> Form | None:
    return db.execute(
        select(Form).where(Form.share_id == share_id)
    ).scalar_one_or_none()


def get_all_forms(db: Session, skip: int = 0, limit: int = 20) -> list[Form]:
    return list(
        db.execute(select(Form).offset(skip).limit(limit)).scalars().all()
    )


def update_form(db: Session, form_id: int, update_data: FormUpdate) -> Form | None:
    form = get_form_by_id(db, form_id)
    if form is None:
        return None

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(form, field, value)

    db.commit()
    db.refresh(form)
    return form


def delete_form(db: Session, form_id: int) -> Form | None:
    form = get_form_by_id(db, form_id)
    if form is None:
        return None

    db.delete(form)
    db.commit()
    return form
