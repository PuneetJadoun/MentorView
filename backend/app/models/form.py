from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.question import Question
    from app.models.response import Response


class Form(Base):
    __tablename__ = "forms"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str | None] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(nullable=False, default="draft")
    share_id: Mapped[str] = mapped_column(unique=True, nullable=False)
    theme_color: Mapped[str | None] = mapped_column(nullable=True)
    background_color: Mapped[str | None] = mapped_column(nullable=True)
    font_family: Mapped[str | None] = mapped_column(nullable=True)
    dark_mode: Mapped[bool] = mapped_column(nullable=False, default=False)
    thank_you_title: Mapped[str | None] = mapped_column(nullable=True)
    thank_you_subtitle: Mapped[str | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False, server_default=func.now(), onupdate=func.now()
    )

    questions: Mapped[list["Question"]] = relationship(
        back_populates="form", cascade="all, delete-orphan"
    )
    responses: Mapped[list["Response"]] = relationship(
        back_populates="form", cascade="all, delete-orphan"
    )
