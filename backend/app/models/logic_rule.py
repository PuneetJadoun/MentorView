from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.question import Question


class LogicRule(Base):
    __tablename__ = "logic_rules"

    id: Mapped[int] = mapped_column(primary_key=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"), nullable=False)
    option_id: Mapped[int] = mapped_column(ForeignKey("question_options.id"), nullable=False)
    target_question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"), nullable=False)

    question: Mapped["Question"] = relationship(
        back_populates="logic_rules", foreign_keys=[question_id]
    )
