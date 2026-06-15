from sqlmodel import select, func
from uuid import UUID
from datetime import datetime
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, status, Form, UploadFile, File, Depends, HTTPException
from fastapi.responses import RedirectResponse
from typing import Optional
from app.services.uploads import validate_media_constraints
from app.schemas.uploads import UploadResponse, Categories, Uploads, PaginatedUploadResponse
from app.schemas.user import CurrentUser
from app.services.db import get_async_session
from app.services.auth import Scopes, Require_scope


uploads_router = APIRouter(prefix="/api/v1/talent", tags=["Handles Talent Submissions"])


@uploads_router.post("/uploads", status_code=status.HTTP_201_CREATED, response_model=UploadResponse)
async def uploads(
    category: Categories = Form(...),
    title: str = Form(..., min_length=4, max_length=100),
    description: str = Form(None, min_length=10, max_length=300),
    materials_used: Optional[str] = Form(None, max_length=1000),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_session),
    # 🌟 Real Scope Guard: Ensures token is verified and contains valid upload execution permissions
    current_user: CurrentUser = Depends(Require_scope(Scopes.MEDIA_UPLOAD))  
):
    """Handles media uploads, processes constraints via Cloudinary threadpools, and saves records."""
    try:
        # 1. Run the blocking synchronous Cloudinary wrapper inside an asynchronous worker threadpool 
        media_url, cloudinary_id = await run_in_threadpool(validate_media_constraints, file)

        # 2. Map payload properties directly to your production SQLModel database schemas
        upload = Uploads(
            category=category,
            title=title,
            description=description,
            materials_used=materials_used,
            media_url=media_url,
            # 🌟 FIXED: Links dynamically to the true unique user id attribute properties mapping
            user_id=current_user.user_id, 
            cloudinary_id=cloudinary_id,
            is_approved=False, # Routes asset straight to your admin evaluation panels
            created_at=datetime.utcnow() # Native naive timestamp handling matching column expectations
        )

        db.add(upload)
        await db.commit()
        await db.refresh(upload)

        return upload

    except Exception as e:
        await db.rollback()
        print(f"❌ REJECTED FORM STREAM TRANSACTION: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database upload streaming transaction rolled back: {str(e)}"
        )


@uploads_router.get("/entries", response_model=PaginatedUploadResponse, status_code=status.HTTP_200_OK)
async def get_approved_entries(
    category: Optional[Categories] = None,
    limit: int = 12,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session)
):
    """Returns all approved platform submissions dynamically using offset paginations."""
    filter_stmt = select(Uploads).where(Uploads.is_approved == True)

    if category:
        filter_stmt = filter_stmt.where(Uploads.category == category)

    count_stmt = select(func.count()).select_from(filter_stmt.subquery())
    count_result = await db.execute(count_stmt)
    total_count = count_result.scalar_one()

    data_stmt = filter_stmt.order_by(Uploads.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(data_stmt)
    items = result.scalars().all()

    has_more = offset + len(items) < total_count

    return PaginatedUploadResponse(
        items=items,
        total_count=total_count,
        limit=limit,
        offset=offset,
        has_more=has_more
    )


@uploads_router.get("/entries/{upload_id}", response_model=UploadResponse, status_code=status.HTTP_200_OK)
async def get_approved_entry(upload_id: UUID, db: AsyncSession = Depends(get_async_session)):
    """Return a specified single upload entry if it's already cleared by moderators."""
    stmt = select(Uploads).where(Uploads.upload_id == upload_id)
    app_stmt = stmt.where(Uploads.is_approved == True)
    app_result = await db.execute(app_stmt)
    entry = app_result.scalar_one_or_none()

    if entry:
        return entry
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested submission entry cannot be found or is pending verification."
        )
    

@uploads_router.get("/media/{upload_id}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def stream_media(upload_id: UUID, db: AsyncSession = Depends(get_async_session)):
    """Bounces the requester browser directly out to the asset storage path location hosted on Cloudinary CDN networks."""
    stmt = select(Uploads).where(Uploads.upload_id == upload_id)
    app_stmt = stmt.where(Uploads.is_approved == True)
    result = await db.execute(app_stmt)
    entry = result.scalar_one_or_none()

    if entry:
        return RedirectResponse(url=entry.media_url)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested media file asset not found."
        )