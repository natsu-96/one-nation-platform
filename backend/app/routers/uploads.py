from sqlmodel import select, func
from uuid import UUID
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, status, Form, UploadFile, File, Depends, HTTPException
from fastapi.responses import RedirectResponse
from typing import Optional
from services.uploads import validate_media_constraints
from schemas.uploads import UploadResponse, Categories, Uploads, PaginatedUploadResponse
from schemas.user import CurrentUser
from services.db import get_async_session
from services.auth import Scopes, Require_scope


uploads_router = APIRouter(prefix="/api/v1/talent", tags=["Handles Talent Submissions"])


class MockUser:
    def __init__(self):
        self.user_id = "2dc68776-22bb-42ba-8ae3-f4f3c52dbc91"

@uploads_router.post("/uploads", status_code=status.HTTP_201_CREATED, response_model=UploadResponse)
async def uploads(
    category: Categories = Form(...),
    title: str = Form(..., min_length=4, max_length=100),
    description: str = Form(None, min_length=10, max_length=300),
    materials_used: Optional[str] = Form(None, max_length=1000),

    file: UploadFile = File(...),

    db: AsyncSession = Depends(get_async_session),
    # current_user: CurrentUser = Depends(Require_scope(Scopes.MEDIA_UPLOAD))  

    current_user = MockUser()
):
    """Handles media uploads and stores them to the database"""
    media_url, cloudinary_id = await run_in_threadpool(validate_media_constraints, file)

    upload = Uploads(
        category=category,
        title=title,
        description=description,
        materials_used=materials_used,
        media_url=media_url,
        user_id=current_user.user_id,
        cloudinary_id=cloudinary_id,
        is_approved=False
    )

    db.add(upload)
    await db.commit()
    await db.refresh(upload)


    return upload


@uploads_router.get("/entries", response_model=PaginatedUploadResponse, status_code=status.HTTP_200_OK)
async def get_approved_entries(
    category: Optional[Categories] = None,
    limit: int = 12,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session)
):
    """Returns all uploaded entries"""
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
    """Return a specified upload entry if it's approved"""
    stmt = select(Uploads).where(Uploads.upload_id == upload_id)
    app_stmt = stmt.where(Uploads.is_approved == True)
    app_result = await db.execute(app_stmt)
    entry = app_result.scalar_one_or_none()

    if entry:
        return entry
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The Entry cannot be found"
        )
    

@uploads_router.get("/media/{upload_id}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def stream_media(upload_id: UUID, db: AsyncSession = Depends(get_async_session)):
    """Streams/renders specified media"""
    stmt = select(Uploads).where(Uploads.upload_id == upload_id)

    app_stmt = stmt.where(Uploads.is_approved == True)
    result = await db.execute(app_stmt)

    entry = result.scalar_one_or_none()

    if entry:
        return RedirectResponse(url = entry.media_url)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested media file not found."
        )
