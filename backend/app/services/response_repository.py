from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.response import Response


def create_response(db: Session, form_id: int) -> Response:
    response = Response(
        form_id=form_id,
        completed=True,
        progress_percentage=100,
        submitted_at=datetime.utcnow(),
    )
    db.add(response)
    db.commit()
    db.refresh(response)
    return response


def get_response_by_id(db: Session, response_id: int) -> Response | None:
    return db.get(Response, response_id)


def get_responses_by_form(db: Session, form_id: int) -> list[Response]:
    return list(
        db.execute(
            select(Response).where(Response.form_id == form_id).order_by(Response.id)
        )
        .scalars()
        .all()
    )
