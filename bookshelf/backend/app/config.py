import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://bookshelf:bookshelf@localhost:5432/bookshelf"
)
