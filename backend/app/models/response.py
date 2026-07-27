from datetime import datetime

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Response(Base):
    __tablename__ = "responses"

    id: Mapped[int] = mapped_column(primary_key=True)
    form_id: Mapped[int] = mapped_column(ForeignKey("forms.id"), nullable=False)
    completed: Mapped[bool] = mapped_column(nullable=False, default=False)
    progress_percentage: Mapped[int] = mapped_column(nullable=False, default=0)
    started_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    submitted_at: Mapped[datetime | None] = mapped_column(nullable=True)
