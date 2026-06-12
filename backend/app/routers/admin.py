from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from uuid import UUID
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from services.db import get_async_session
from services.auth import Require_scope, ROLE_PERMISSIONS
from schemas.uploads import Uploads, UploadResponse
from schemas.quiz import QuizSession, QuizQuestion
from schemas.nominees import NomineeResponse, Nominee


admin_router = APIRouter(prefix="/api/v1/admin", tags=["Admin Backoffice Control"])

class AdminQuestionInput(BaseModel):
    """Guarantees full type-safety for bulk admin question injections."""
    question_text: str = Field(..., min_length=5)
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str = Field(..., min_length=1, max_length=1) # Enforce 'A', 'B', 'C', or 'D'

@admin_router.get("/pending-uploads", response_model=List[UploadResponse])
async def get_pending_uploads(
    current_user = Depends(Require_scope(ROLE_PERMISSIONS.get("ADMIN", []))),
    db: AsyncSession = Depends(get_async_session),
):
    """Returns all pending uploads for review"""
    stmt = (
        select(Uploads).where(Uploads.is_approved==False)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@admin_router.put("/approve-uploads/{upload_id}", status_code=status.HTTP_200_OK)
async def approve_uploads(
    upload_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user= Depends(Require_scope(ROLE_PERMISSIONS.get("ADMIN", [])))
):
    """Approves Uploads"""
    stmt = (
        select(Uploads).where(Uploads.is_approved==False).where(Uploads.upload_id == upload_id)
    )
    results = await db.execute(stmt)
    upload = results.scalar_one_or_none()

    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Specified upload not available"
        )
    
    upload.is_approved = True
    db.add(upload)
    await db.commit()

    return {"status": "success", "message": f"File Entry {upload_id} has been approved successfully."}

@admin_router.post("/seed-questions/{session_id}", status_code=status.HTTP_201_CREATED)
async def post_questions(
    session_id: UUID,
    questions_list: List[AdminQuestionInput],
    db: AsyncSession = Depends(get_async_session), 
    current_user = Depends(Require_scope(ROLE_PERMISSIONS.get("ADMIN", [])))
):
    """Bulk inserts a JSON array of questions into the Database"""
    session_check = await db.execute(select(QuizSession).where(QuizSession.id == session_id))
    if not session_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Target quiz session does not exist.")

    inserted_count = 0
    for q in questions_list:
        new_question = QuizQuestion(
            quiz_session_id=session_id,
            question_text=q["question_text"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_option=q["correct_option"].upper()
        )
        db.add(new_question)
        inserted_count += 1
        
    await db.commit()
    return {"status": "success", "message": f"Injected {inserted_count} questions into session {session_id}."}


@admin_router.get("/pending-nominees", response_model=List[NomineeResponse])
async def get_pending_nominees(
    db: AsyncSession = Depends(get_async_session),
    current_user = Depends(Require_scope(ROLE_PERMISSIONS.get("ADMIN", [])))
):
    """Returns a list of pending nominees for national heroes"""
    stmt = (
        select(Nominee).where(Nominee.is_featured==False)
    )
    result = await db.execute(stmt)

    nominees = result.scalars().all()

    return nominees


@admin_router.put("/approve-nominee/{nominee_id}", status_code=status.HTTP_200_OK)
async def approve_nominees(
    nominee_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user = Depends(Require_scope(ROLE_PERMISSIONS.get("ADMIN", [])))
):
    """Approves a community nominated icon, pushing them to the main compendium layout"""

    stmt = (
        select(Nominee).where(Nominee.id==nominee_id)
    )
    result = await db.execute(stmt)

    nominee = result.scalar_one_or_none()

    if not nominee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = "Nominee not found"
        )
    
    if nominee.is_featured == True:
        return {"status": "info", "message": f"'{nominee.name}' is already live in the compendium."}
    
    nominee.is_featured = True
    db.add(nominee)
    await db.commit()

    return {"status": "success", "messages": f"'{nominee.name}' has been safely approved and published live!"}