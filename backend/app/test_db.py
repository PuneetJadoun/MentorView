from sqlalchemy import text
from app.db.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT sqlite_version();"))
        print("Connected successfully!")
        print("SQLite Version:", result.scalar())
except Exception as e:
    print("Connection Failed:", e)