from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


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
    created_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False, server_default=func.now(), onupdate=func.now()
    )
