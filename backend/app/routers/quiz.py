from fastapi import APIRouter, Depends, HTTPException, status
from schemas.quiz import (
    QuizCategories, 
    QuizQuestion, 
    QuizScore, 
    QuizSession, 
    UserAnswerItem, 
    QuizSubmissionPayload, 
    ClientQuestionResponse

)
from services.db import get_async_session
from services.auth import Scopes, Require_scope, get_current_user
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user import CurrentUser
from sqlmodel import select, func

quiz_router = APIRouter(prefix="/api/v1/quiz", tags=["Handles Quiz related operations"])


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
        {"quiz": quiz.title, "category": quiz.category} for quiz in active_quizzes
    ]
        
@quiz_router.get("/questions/{quiz_session_id}", response_model=List[ClientQuestionResponse])
async def get_session_questions(
    quiz_session_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Sends a payload of questions to the frontend"""
    session_stmt = select(QuizSession).where(QuizSession.id == id).where(QuizSession.is_active==True)
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


@quiz_router.post("/submit-score", status_code=status.HTTP_201_OK)
async def submit_quiz_score(
    payload: dict, 
    db: AsyncSession = Depends(get_async_session), 
    current_user: CurrentUser = Depends(get_current_user)
    ):
    """Securely sends the payload with the user's answers"""
    submitted_question_ids = [item.question_id for item in payload.answers]
    stmt = select(QuizQuestion).where(QuizQuestion.id.in_(submitted_question_ids))
    result = await db.execute(stmt)
    answer_key_map = {q.id: q for q in result.scalars().all()}

    total_calculated_score = 0
    BASE_POINTS = 100
    TOTAL_TIME_ALLOWED = 10.0

    # 2. Calculate time-decay scores for correct answers
    for item in payload.answers:
        question = answer_key_map.get(item.question_id)
        if not question:
            continue

        if item.chosen_option.upper() == question.correct_option.upper():
            # Safeguard boundary to prevent raw payload tampering
            safe_time = min(max(item.time_remaining, 0.0), TOTAL_TIME_ALLOWED)
            
            time_weight = safe_time / TOTAL_TIME_ALLOWED
            earned_points = int(BASE_POINTS * time_weight)
            total_calculated_score += earned_points

    # 3. Log the record into the user score history
    score_receipt = QuizScore(
        user_id=current_user.id,
        quiz_session_id=payload.quiz_session_id,
        score=total_calculated_score
    )
    
    db.add(score_receipt)
    await db.commit()

    return {
        "status": "success",
        "message": "Your score has been processed and saved successfully!",
        "score_achieved": total_calculated_score
    }