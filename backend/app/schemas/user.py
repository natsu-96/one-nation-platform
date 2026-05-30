from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional
from pydantic import EmailStr
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    username: str = Field(unique=True)
    email: EmailStr

class UserCreate(UserBase):
    referred_by: Optional[str] = None
    password: str


class UserResponse(UserBase):
    user_id : UUID
    created_at: datetime
    referral_code: str 
    referred_by: Optional[UUID]

    class Config:
        from_attributes = True


class UserInDb(UserBase, table=True):
    __tablename__ = "users"

    user_id: UUID = Field(default_factory=uuid4, primary_key=True)
    referral_code: str = Field(unique=True, index=True)
    referred_by: Optional[UUID] = Field(default=None, foreign_key="users.user_id")
    hashed_pass: str 
    created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))
