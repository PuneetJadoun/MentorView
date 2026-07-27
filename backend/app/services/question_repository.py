from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionReorderItem, QuestionUpdate


def _next_position(db: Session, form_id: int) -> int:
    return len(get_questions_by_form(db, form_id)) + 1


def create_question(db: Session, form_id: int, question_data: QuestionCreate) -> Question:
    question = Question(
        form_id=form_id,
        title=question_data.title,
        description=question_data.description,
        type=question_data.type,
        required=question_data.required,
        position=(
            question_data.position
            if question_data.position is not None
            else _next_position(db, form_id)
        ),
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


def get_question_by_id(db: Session, question_id: int) -> Question | None:
    return db.get(Question, question_id)


def get_questions_by_form(db: Session, form_id: int) -> list[Question]:
    return list(
        db.execute(
            select(Question).where(Question.form_id == form_id).order_by(Question.position)
        )
        .scalars()
        .all()
    )


def update_question(
    db: Session, question_id: int, update_data: QuestionUpdate
) -> Question | None:
    question = get_question_by_id(db, question_id)
    if question is None:
        return None

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)
    return question


def delete_question(db: Session, question_id: int) -> Question | None:
    question = get_question_by_id(db, question_id)
    if question is None:
        return None

    db.delete(question)
    db.commit()
    return question


def reorder_questions(
    db: Session, form_id: int, items: list[QuestionReorderItem]
) -> list[Question]:
    questions_by_id = {q.id: q for q in get_questions_by_form(db, form_id)}
    for item in items:
        question = questions_by_id.get(item.question_id)
        if question is not None:
            question.position = item.position

    db.commit()
    return get_questions_by_form(db, form_id)
