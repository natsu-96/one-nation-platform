from enum import StrEnum
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel


class QuizCategories(StrEnum):
    HISTORY = "history"
    GEOGRAPHY = "geography"
    ENTERTAINMENT = "entertainment"
    SPORTS = "sports"
    TECH = "tech"
    HEROES = "heroes"
    CULTURE = "culture"

# 🌟 FIXED: Updated ID validations from int to UUID to match database fields
class UserAnswerItem(BaseModel):
    question_id: UUID  # Changed from int to UUID
    chosen_option: str  # Must accept "A", "B", "C", or "D"
    time_remaining: float  # Seconds left on their 10.0s local visual timer

# 🌟 FIXED: Updated Session validation from int to UUID
class QuizSubmissionPayload(BaseModel):
    quiz_session_id: UUID  # Changed from int to UUID
    answers: List[UserAnswerItem]

class ClientQuestionResponse(BaseModel):
    """Safely delivers question variations to contestants without leaking the answer sheet."""
    id: Optional[UUID]  # Changed from int to UUID to match DB models
    quiz_session_id: UUID  # Changed from int to UUID to match DB models
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str


class QuizSession(SQLModel, table=True):
    __tablename__ = "quiz_sessions"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    category: QuizCategories = Field(index=True)
    title: str  
    is_active: bool = Field(default=True, index=True)  
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Cascade deletes ensure clean local database resets during testing
    questions: List["QuizQuestion"] = Relationship(
        back_populates="session", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    scores: List["QuizScore"] = Relationship(
        back_populates="session", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class QuizQuestion(SQLModel, table=True):
    __tablename__ = "quiz_questions"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    quiz_session_id: UUID = Field(foreign_key="quiz_sessions.id")
    question_text: str
    
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str  # Enforce 'A', 'B', 'C', or 'D' on the frontend
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    session: QuizSession = Relationship(back_populates="questions")

class QuizScore(SQLModel, table=True):
    __tablename__ = "quiz_scores"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.user_id", index=True)
    quiz_session_id: UUID = Field(foreign_key="quiz_sessions.id")
    score: int  
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    session: QuizSession = Relationship(back_populates="scores")