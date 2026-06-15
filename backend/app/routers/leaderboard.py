from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.votes import Votes
from sqlmodel import select
from schemas.uploads import Categories, UploadResponse, Uploads
from typing import List
from app.services.db import get_async_session

leaderboard_router = APIRouter(prefix="/api/v1/leaderboard", tags=["Public Leaderboards"])

@leaderboard_router.get("/talent/{category}", response_model=List[UploadResponse])
async def vote_leaderboard(category: Categories, limit: int=20, db: AsyncSession = Depends(get_async_session)):
    """Return the leaderboard for Talents in a specified category"""

    stmt = select(Uploads).where(Uploads.category == category).where(Uploads.is_approved == True)
    stmt2 = stmt.order_by(Uploads.vote_count.desc()).limit(limit)

    result = await db.execute(stmt2)

    entries = result.scalars().all()

    return entries

# Append this directly to your existing leaderboard router file

@leaderboard_router.get("/talent/top/global", response_model=List[UploadResponse])
async def get_global_top_talents(limit: int = 3, db: AsyncSession = Depends(get_async_session)):
    """
    Returns the top-voted approved talent entries platform-wide, 
    perfect for landing page champion sliders.
    """
    try:
        # 1. Query approved uploads across all categories sorted by vote counts
        stmt = (
            select(Uploads)
            .where(Uploads.is_approved == True)
            .order_by(Uploads.vote_count.desc())
            .limit(limit)
        )
        
        result = await db.execute(stmt)
        entries = result.scalars().all()
        
        return entries

    except Exception as e:
        print(f"❌ GLOBAL LEADERBOARD FETCH FAULT: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to compile aggregate champion rankings."
        )