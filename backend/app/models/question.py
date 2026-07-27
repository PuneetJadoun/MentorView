from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


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
