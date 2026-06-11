from typing import Annotated
from fastapi import APIRouter, Depends, status, HTTPException
from schemas.user import UserCreate, UserInDb, UserResponse, CurrentUser
from services.auth import create_access_token, pwd_context, generate_referral_code, get_current_user
from services.db import get_async_session
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from schemas.uploads import Uploads
from schemas.quiz import QuizScore

auth_router = APIRouter(prefix="/api/v1/auth", tags=["Authentication and Registration"])


@auth_router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, session: AsyncSession = Depends(get_async_session)):
    """Handles User Registration"""
    stmt = select(UserInDb).where(UserInDb.email==user.email)
    exists = await session.execute(stmt)
    results = exists.scalar_one_or_none()

    if results:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    referrer_id = None

    if user.referred_by:
        ref_stmt = select(UserInDb).where(UserInDb.referral_code == user.referred_by)
        ref_exists = await session.execute(ref_stmt)
        ref_by = ref_exists.scalar_one_or_none()

        if not ref_by:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Referral code is invalid"
            )
        
        referrer_id = ref_by.user_id

    user_dict = user.model_dump(exclude={"password", "referred_by"})
    hashed_pass = pwd_context.hash(user.password)

    while True:
        new_code = generate_referral_code()
        code_check = select(UserInDb).where(UserInDb.referral_code == new_code)
        code_exists = await session.execute(code_check)
        if not code_exists.scalar_one_or_none():
            break

    db_user = UserInDb(**user_dict, hashed_pass=hashed_pass, referred_by=referrer_id, referral_code=new_code)

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)

    return db_user
    

@auth_router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: AsyncSession = Depends(get_async_session)):
    """Handles Login and JWT creation"""
    username = form_data.username
    password = form_data.password

    user_stmt = select(UserInDb).where(UserInDb.username == username)
    results = await session.execute(user_stmt)
    user = results.scalar_one_or_none()

    if not user or not pwd_context.verify(password, user.hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token_payload = {
        "sub": str(user.user_id),
        "role": user.role
        }

    token = create_access_token(token_payload)

    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/arena/dashboard", status_code=status.HTTP_200_OK)
async def get_user_arena_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Returns profile information combined with specific user statistics 
    (Total talent uploads and quiz history) to populate the My Arena view.
    """
    # 1. Fetch user's talent submission history count
    upload_stmt = select(Uploads).where(Uploads.user_id == current_user.user_id)
    upload_exec = await session.execute(upload_stmt)
    user_uploads = upload_exec.scalars().all()
    
    # 2. Fetch user's past quiz scores
    quiz_stmt = select(QuizScore).where(QuizScore.user_id == current_user.user_id)
    quiz_exec = await session.execute(quiz_stmt)
    user_scores = quiz_exec.scalars().all()
    
    return {
        "user": {
            "user_id": current_user.user_id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role,
            "referral_code": current_user.referral_code,
        },
        "stats": {
            "total_uploads": len(user_uploads),
            "quiz_attempts": len(user_scores)
        },
        "quiz_history": [
            {"quiz_session_id": score.quiz_session_id, "score": score.score, "completed_at": score.completed_at}
            for score in user_scores
        ]
    }