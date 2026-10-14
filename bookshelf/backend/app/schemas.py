from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BookBase(BaseModel):
    """Base schema shared by create and response."""

    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    genre: Optional[str] = None
    status: str = Field(default="wishlist", pattern="^(wishlist|reading|completed)$")
    rating: Optional[int] = Field(default=None, ge=1, le=5)


class BookCreate(BookBase):
    """Schema for creating a new book."""

    pass


class BookUpdate(BaseModel):
    """Schema for updating a book — all fields optional."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    author: Optional[str] = Field(default=None, min_length=1, max_length=255)
    genre: Optional[str] = None
    status: Optional[str] = Field(default=None, pattern="^(wishlist|reading|completed)$")
    rating: Optional[int] = Field(default=None, ge=1, le=5)


class BookResponse(BookBase):
    """Schema for book responses — includes id and date_added."""

    id: int
    date_added: datetime

    class Config:
        from_attributes = True
