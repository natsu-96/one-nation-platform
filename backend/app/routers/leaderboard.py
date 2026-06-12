from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.votes import Votes
from sqlmodel import select
from schemas.uploads import Categories, UploadResponse, Uploads
from typing import List
from services.db import get_async_session

leaderboard_router = APIRouter(prefix="/api/v1/leaderboard", tags=["Public Leaderboards"])

@leaderboard_router.get("/talent/{category}", response_model=List[UploadResponse])
async def vote_leaderboard(category: Categories, limit: int=20, db: AsyncSession = Depends(get_async_session)):
    """Return the leaderboard for Talents in a specified category"""

    stmt = select(Uploads).where(Uploads.category == category).where(Uploads.is_approved == True)
    stmt2 = stmt.order_by(Uploads.vote_count.desc()).limit(limit)

    result = await db.execute(stmt2)

    entries = result.scalars().all()

    return entries