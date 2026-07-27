from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.answer import Answer
    from app.models.form import Form
    from app.models.logic_rule import LogicRule
    from app.models.question_option import QuestionOption


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    form_id: Mapped[int] = mapped_column(ForeignKey("forms.id"), nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str | None] = mapped_column(nullable=True)
    type: Mapped[str] = mapped_column(nullable=False)
    required: Mapped[bool] = mapped_column(nullable=False, default=False)
    position: Mapped[int] = mapped_column(nullable=False)
    allow_multiple_files: Mapped[bool] = mapped_column(nullable=False, default=False)

    form: Mapped["Form"] = relationship(back_populates="questions")
    options: Mapped[list["QuestionOption"]] = relationship(
        back_populates="question", cascade="all, delete-orphan"
    )
    logic_rules: Mapped[list["LogicRule"]] = relationship(
        back_populates="question",
        foreign_keys="LogicRule.question_id",
        cascade="all, delete-orphan",
    )
    answers: Mapped[list["Answer"]] = relationship(
        back_populates="question", cascade="all, delete-orphan"
    )
