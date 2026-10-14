from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Book(Base):
    """SQLAlchemy model for the books table."""

    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    genre = Column(String(100), nullable=True)
    status = Column(String(50), default="wishlist")  # wishlist | reading | completed
    rating = Column(Integer, nullable=True)
    date_added = Column(DateTime(timezone=True), server_default=func.now())
