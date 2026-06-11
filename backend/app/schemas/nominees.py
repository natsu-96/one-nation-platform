from sqlmodel import SQLModel, Field, UniqueConstraint
from datetime import datetime, timezone
from typing import Optional
from enum import StrEnum
from uuid import UUID, uuid4


class NomineeResponse(SQLModel):
    name: str
    image_url: str


class NomineeCategories(StrEnum):
    ARTS = "Arts & Literature"
    SCIENCE = "Science & Tech"
    HEROES = "National Heroes"
    SPORTS = "Sports Legends"
    HUMANITIES = "Humanities and contribution to society"

class Nominee(SQLModel, table=True):
    __tablename__ = "nominees"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)  # Name of the notable Nigerian 
    bio: str  # Short biography highlighting their achievements 
    category: NomineeCategories
    cloudinary_url: str  # Cloud storage or local asset link for their profile picture
    cloudinary_id: str 
    votes_count: Optional[int] = Field(default=0, index=True)  # Tracks community votes [cite: 65]
    is_featured: bool = Field(default=False, index=True)  # Dynamic curation flag [cite: 70]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CompendiumVotes(SQLModel, table=True):
    __tablename__ = "CompendiumVotes"
    
    # Enforce a hard database-level constraint so a user cannot vote twice for the same icon
    __table_args__ = (
        UniqueConstraint("user_id", "nominee_id", name="unique_user_vote_per_nominee"),
    )
    
    vote_id: UUID = Field(default_factory=uuid4, primary_key=True)
    
    # Foreign key mapping back to your user table integer primary key id sequence
    user_id: int = Field(foreign_key="users.user_id", index=True, nullable=False)
    
    # Foreign key mapping back to the CompendiumNominees UUID primary key sequence
    nominee_id: UUID = Field(foreign_key="nominees.id", index=True, nullable=False)
    
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
