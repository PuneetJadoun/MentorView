from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.question_option import QuestionOption
from app.schemas.question import QuestionOptionCreate, QuestionOptionUpdate


def _next_position(db: Session, question_id: int) -> int:
    return len(get_options_by_question(db, question_id)) + 1


def create_option(
    db: Session, question_id: int, option_data: QuestionOptionCreate
) -> QuestionOption:
    option = QuestionOption(
        question_id=question_id,
        option_text=option_data.option_text,
        position=_next_position(db, question_id),
    )
    db.add(option)
    db.commit()
    db.refresh(option)
    return option


def get_option_by_id(db: Session, option_id: int) -> QuestionOption | None:
    return db.get(QuestionOption, option_id)


def get_options_by_question(db: Session, question_id: int) -> list[QuestionOption]:
    return list(
        db.execute(
            select(QuestionOption)
            .where(QuestionOption.question_id == question_id)
            .order_by(QuestionOption.position)
        )
        .scalars()
        .all()
    )


def update_option(
    db: Session, option_id: int, option_data: QuestionOptionUpdate
) -> QuestionOption | None:
    option = get_option_by_id(db, option_id)
    if option is None:
        return None

    for field, value in option_data.model_dump(exclude_unset=True).items():
        setattr(option, field, value)

    db.commit()
    db.refresh(option)
    return option


def delete_option(db: Session, option_id: int) -> QuestionOption | None:
    option = get_option_by_id(db, option_id)
    if option is None:
        return None

    db.delete(option)
    db.commit()
    return option
