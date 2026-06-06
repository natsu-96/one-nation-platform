from fastapi import APIRouter, Depends, status, HTTPException, Form, UploadFile, File
from fastapi.concurrency import run_in_threadpool
from schemas.nominees import Nominee, NomineeResponse, NomineeCategories, CompendiumVotes
from schemas.user import CurrentUser
from services.auth import get_current_user
from services.db import get_async_session
from services.uploads import validate_media_constraints
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

nominees_router = APIRouter(prefix="/api/v1/national-heroes", tags=["Nomination and voting of national heroes"])

@nominees_router.post("/nominate", response_model=NomineeResponse)
async def nominate_hero(
    name: str = Form(...),
    bio: str = Form(..., min_length=20, max_length=500),
    category: NomineeCategories = Form(...),
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Submitting a national figure for nomination and recognition"""
    stmt = select(Nominee).where(func.lower(Nominee.name) == func.lower(name))
    result = await db.execute(stmt)

    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This individual is already nominated"
        )
    
    image_url, cloudinary_id = await run_in_threadpool(validate_media_constraints, file)

    nominee = Nominee(
        name=name,
        bio=bio,
        cloudinary_url=image_url,
        category=category,
        cloudinary_id=cloudinary_id,
        votes_count=0
    )
    
    db.add(nominee)
    await db.commit()
    await db.refresh(nominee)

    return nominee

@nominees_router.post("/vote/{nominee_id}", status_code=status.HTTP_200_OK)
async def vote_for_nominee(
    nominee_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Increments public vote totals for an approved compendium icon."""
    
    nominee_stmt = select(Nominee).where(Nominee.id == nominee_id).where(Nominee.is_featured == True)
    nominee_exec = await db.execute(nominee_stmt)
    nominee = nominee_exec.scalar_one_or_none()

    if not nominee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nominee profile not found or it is pending admin moderation review."
        )

    # 2. Check for Duplicate Votes by this specific user
    vote_check_stmt = select(CompendiumVotes).where(
        CompendiumVotes.user_id == current_user.user_id,
        CompendiumVotes.nominee_id == nominee_id
    )
    vote_check_exec = await db.execute(vote_check_stmt)
    if vote_check_exec.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already cast a ballot for this national icon record."
        )

    # 3. Transaction Block
    try:
        vote_receipt = CompendiumVotes(user_id=current_user.id, nominee_id=nominee_id)
        db.add(vote_receipt)

        nominee.votes_count = nominee.votes_count + 1
        db.add(nominee)

        await db.commit()
        return {"status": "success", "message": f"Ballot cast successfully for {nominee.name}!"}

    except Exception:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Transaction collision detected. Your vote was protected from dropping."
        )


@nominees_router.get("/featured", status_code=status.HTTP_200_OK)
async def get_featured_compendium(
    limit: int = 12, # Fits beautifully into a responsive 3 or 4 column grid
    db: AsyncSession = Depends(get_async_session)
):
    """Public. Returns highly upvoted approved profiles sorted to drive frontend card blocks."""
    
    # Pull approved profiles ordered descending by your indexed cache field
    stmt = (
        select(Nominee)
        .where(Nominee.is_featured == True)
        .order_by(Nominee.votes_count.desc())
        .limit(limit)
    )
    
    result = await db.execute(stmt)
    featured_icons = result.scalars().all()

    if not featured_icons:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No approved compendium profiles are active yet."
        )

    return featured_icons