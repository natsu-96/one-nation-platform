from enum import StrEnum
from token import OP
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from pydantic import FileUrl

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

class UploadResponse(SQLModel):
    upload_id: UUID
    user_id: UUID
    media_url: str
    created_at: datetime

class Uploads(UploadBase, table=True):
    __tablename__ = "Uploads"

    upload_id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.user_id")
    media_filename: str
    is_approved: bool = Field(index=True, default=False)
    created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))

