from sqlmodel import SQLModel, Field, UniqueConstraint
from uuid import UUID, uuid4
from datetime import datetime, timezone

class VotesBase(SQLModel):
    upload_id: UUID = Field(foreign_key="uploads.upload_id")

class Votes(VotesBase, table=True):
    __tablename__ = "users"

    __table_args__ = (
        UniqueConstraint("user_id", "upload_id", name="unique_user_vote_per_entry")
    )
    vote_id: UUID = Field(primary_key=True, default_factory=uuid4)
    user_id: UUID = Field(foreign_key="users.user_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))