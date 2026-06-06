from enum import StrEnum
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional
from pydantic import EmailStr, BaseModel
from sqlmodel import SQLModel, Field


class Roles(StrEnum):
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"

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
    referred_by: Optional[UUID] = None

    class Config:
        from_attributes = True

class CurrentUser(BaseModel):
    user_id: UUID
    role: Roles


class UserInDb(UserBase, table=True):
    __tablename__ = "users"

    user_id: UUID = Field(default_factory=uuid4, primary_key=True)
    referral_code: str = Field(unique=True, index=True)
    referred_by: Optional[UUID] = Field(default=None, foreign_key="users.user_id")
    role: Roles = Field(default=Roles.USER, index=True)
    hashed_pass: str 
    created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))
