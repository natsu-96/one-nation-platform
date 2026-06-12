from enum import StrEnum
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class Categories(StrEnum):
    MUSIC = "Music / Songs"
    FOOTBALL_FREESTYLE = "Football Freestyle"
    BASKETBALL_FREESTYLE = "Basketball Freestyle"
    COMEDY_SKITS = "Comedy Skits"
    ARTWORK = "Artwork (Handmade Only)"
    HAIR_ARTISTRY = "Hair Artistry"
    FASHION = "Fashion Showcase"
    NIGERIA_STORY = "My Nigeria Story (Short Film)"
    PHOTOGRAPHY = "Photography"
    TECH_INNOVATION = "Tech Innovation"
    LOGO_DESIGN = "Logo Design"

class UploadBase(SQLModel):
    category: Categories
    title: str = Field(min_length=4, max_length=100)
    description: Optional[str] = Field(min_length=10, max_length=300)
    materials_used: Optional[str] = Field(default=None, max_length=1000)

class UploadResponse(UploadBase):
    upload_id: UUID
    user_id: UUID
    media_url: str
    created_at: datetime

class PaginatedUploadResponse(BaseModel):
    items: List[UploadResponse]
    total_count: int
    limit: int
    offset: int
    has_more: bool

class Uploads(UploadBase, table=True):
    __tablename__ = "uploads"

    upload_id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.user_id")
    media_url: str
    cloudinary_id: str
    is_approved: bool = Field(index=True, default=False)
    created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))
    vote_count: int = Field(default=0, index=True)

