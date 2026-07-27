from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Import all model modules so every class registers on Base.registry before
# any relationship() string reference (e.g. "Response", "LogicRule.question_id")
# needs to be resolved. Must stay below Base's definition — see explanation.
from app import models  # noqa: E402,F401