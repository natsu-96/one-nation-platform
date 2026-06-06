from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional

class Nominee(SQLModel, table=True):
    __tablename__ = "nominees"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)  # Name of the notable Nigerian 
    bio: str  # Short biography highlighting their achievements 
    photo_url: str  # Cloud storage or local asset link for their profile picture 
    votes_count: int = Field(default=0, index=True)  # Tracks community votes [cite: 65]
    is_featured: bool = Field(default=False, index=True)  # Dynamic curation flag [cite: 70]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Optional: If you track exactly who nominated them, you can add a foreign key
    # nominated_by: Optional[int] = Field(default=None, foreign_key="user.id")