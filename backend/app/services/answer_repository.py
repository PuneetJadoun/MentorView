from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.answer import Answer


def create_answers_bulk(
    db: Session, response_id: int, answers: list[tuple[int, str]]
) -> list[Answer]:
    objects = [
        Answer(response_id=response_id, question_id=question_id, answer_value=answer_value)
        for question_id, answer_value in answers
    ]
    db.add_all(objects)
    db.commit()
    for obj in objects:
        db.refresh(obj)
    return objects


def get_answers_by_response(db: Session, response_id: int) -> list[Answer]:
    return list(
        db.execute(select(Answer).where(Answer.response_id == response_id)).scalars().all()
    )
