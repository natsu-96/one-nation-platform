from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.quiz import (
    QuizQuestion, 
    QuizScore, 
    QuizSession,
    ClientQuestionResponse,
    QuizCategories
)
from uuid import UUID, uuid4
from app.services.db import get_async_session
from app.services.auth import get_current_user
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import CurrentUser
from sqlmodel import select, func
from pydantic import BaseModel, Field

class AdminQuestionCreate(BaseModel):
    question_text: str = Field(..., alias="questionText")
    option_a: str = Field(..., alias="optionA")
    option_b: str = Field(..., alias="optionB")
    option_c: str = Field(..., alias="optionC")
    option_d: str = Field(..., alias="optionD")
    correct_option: str = Field(..., alias="correctOption")

    class Config:
        populate_by_name = True

class AdminQuizCreatePayload(BaseModel):
    title: str
    category: str = "tech" # Default fallback category scope matching Enum keys
    questions: List[AdminQuestionCreate]


quiz_router = APIRouter(prefix="/api/v1/quiz", tags=["Handles Quiz related operations"])


@quiz_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_quiz_session(
    payload: AdminQuizCreatePayload,
    db: AsyncSession = Depends(get_async_session),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Ingests structural data payloads from Katrina's dynamic dashboard components."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied. Administrative clearance parameters missing."
        )

    try:
        # Match incoming string parameter values against the strict schema Enum tokens
        clean_cat = payload.category.strip().lower()
        matched_category = QuizCategories.TECH
        for cat in QuizCategories:
            if clean_cat == cat.value:
                matched_category = cat
                break

        # 1. Initialize the parent session instance using a native UUID primary key token
        new_session = QuizSession(
            id=uuid4(),
            title=payload.title,
            category=matched_category,
            is_active=True
        )
        db.add(new_session)

        # 2. Map and stitch child items cleanly tracking the bound transaction ID reference
        for q in payload.questions:
            new_question = QuizQuestion(
                id=uuid4(),
                quiz_session_id=new_session.id,
                question_text=q.question_text,
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d,
                correct_option=q.correct_option.upper().strip()
            )
            db.add(new_question)

        await db.commit()

        return {
            "status": "success",
            "message": f"Quiz session '{payload.title}' is now live inside the '{matched_category.value}' arena!",
            "quiz_session_id": str(new_session.id),
            "questions_linked": len(payload.questions)
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database pipeline serialization failure: {str(e)}"
        )


@quiz_router.get("/active", status_code=status.HTTP_200_OK)
async def get_active_quiz(db: AsyncSession = Depends(get_async_session), current_user: CurrentUser = Depends(get_current_user)):
    """Returns a list of Active Quizzes"""
    stmt = select(QuizSession).where(QuizSession.is_active == True)
    result = await db.execute(stmt)
    active_quizzes = result.scalars().all()

    if not active_quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active quizzes at this time"
        )
    
    return [
        {"quiz_session_id": str(quiz.id), "quiz": quiz.title, "category": quiz.category.value} for quiz in active_quizzes
    ]


@quiz_router.get("/questions/{quiz_session_id}", response_model=List[ClientQuestionResponse])
async def get_session_questions(
    quiz_session_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Sends a payload of questions to the frontend"""
    session_stmt = select(QuizSession).where(QuizSession.id == quiz_session_id).where(QuizSession.is_active==True)
    session_result = await db.execute(session_stmt)
    active_session = session_result.scalar_one_or_none()

    if not active_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This session is not active at this time."
        )

    questions_stmt = (
        select(QuizQuestion).where(QuizQuestion.quiz_session_id==quiz_session_id).order_by(func.random()).limit(5)
    )
    questions_result = await db.execute(questions_stmt)
    questions = questions_result.scalars().all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions available for this session"
        )

    return questions


@quiz_router.post("/submit-score", status_code=status.HTTP_200_OK)
async def submit_quiz_score(
    payload: dict, 
    db: AsyncSession = Depends(get_async_session), 
    current_user: CurrentUser = Depends(get_current_user)
):
    """Securely sends the payload with the user's answers"""
    answers = payload.get("answers", [])
    quiz_session_id_raw = payload.get("quiz_session_id")
    
    if not quiz_session_id_raw:
        raise HTTPException(status_code=400, detail="Missing parameter 'quiz_session_id'.")

    # Cast session target ID parameter to a native database UUID cleanly
    try:
        target_session_uuid = UUID(str(quiz_session_id_raw))
    except ValueError:
        raise HTTPException(status_code=400, detail="Provided quiz_session_id is an invalid UUID format.")

    # 🌟 SAFE TYPE CASTING: Parse incoming text IDs to valid UUID objects safely
    submitted_question_ids = []
    for item in answers:
        q_id_raw = item.get("question_id")
        if q_id_raw:
            try:
                submitted_question_ids.append(UUID(str(q_id_raw)))
            except ValueError:
                continue # Skip corrupt entries instead of crashing out the whole evaluation frame

    if not submitted_question_ids:
        raise HTTPException(status_code=400, detail="No valid operational question identifiers supplied.")
    
    stmt = select(QuizQuestion).where(QuizQuestion.id.in_(submitted_question_ids))
    result = await db.execute(stmt)
    answer_key_map = {q.id: q for q in result.scalars().all()}

    total_calculated_score = 0
    BASE_POINTS = 100
    TOTAL_TIME_ALLOWED = 10.0

    for item in answers:
        q_id_raw = item.get("question_id")
        if not q_id_raw:
            continue
            
        try:
            q_id = UUID(str(q_id_raw))
        except ValueError:
            continue

        chosen_option = item.get("chosen_option", "")
        time_remaining = item.get("time_remaining", 0.0)
        
        question = answer_key_map.get(q_id)
        if not question:
            continue

        if chosen_option.upper().strip() == question.correct_option.upper().strip():
            safe_time = min(max(time_remaining, 0.0), TOTAL_TIME_ALLOWED)
            time_weight = safe_time / TOTAL_TIME_ALLOWED
            earned_points = int(BASE_POINTS * time_weight)
            total_calculated_score += earned_points

    # 🌟 DATA MODEL INTERPOLATION CHECK:
    # Ensure value maps matching your database tracking column definitions exactly
    score_receipt = QuizScore(
        user_id=int(current_user.id), # Explicitly cast to integer matching your QuizScore schema configuration
        quiz_session_id=target_session_uuid,
        score=total_calculated_score
    )
    
    db.add(score_receipt)
    await db.commit()

    return {
        "status": "success",
        "message": "Your score has been processed and saved successfully!",
        "score_achieved": total_calculated_score
    }