from typing import Annotated
from fastapi import APIRouter, Depends, status, HTTPException
from app.schemas.user import UserCreate, UserInDb, UserResponse, CurrentUser
from app.services.auth import create_access_token, pwd_context, generate_referral_code, get_current_user
from app.services.db import get_async_session
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
    

@auth_router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Authenticates a user, verifies credentials against Postgres, 
    and returns a cryptographically secure JWT identity bearer token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        stmt = select(UserInDb).where(UserInDb.email == form_data.username.strip().lower())
        result = await db.execute(stmt)
        user_record = result.scalar_one_or_none()

        if not user_record:
            raise credentials_exception

        is_password_valid = pwd_context.verify(form_data.password, user_record.hashed_pass)
        if not is_password_valid:
            raise credentials_exception

        token_payload = {
            "sub": str(user_record.user_id), 
            "role": user_record.role.value if hasattr(user_record.role, "value") else str(user_record.role)
        }

        access_token = create_access_token(payload=token_payload)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": user_record.username,
            "role": user_record.role.value if hasattr(user_record.role, "value") else str(user_record.role),
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ AUTHENTICATION PIPELINE CRASHED: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal authentication system failure: {str(e)}"
        )
    

@auth_router.get("/arena/dashboard", status_code=status.HTTP_200_OK)
async def get_user_arena_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Returns profile information combined with specific user statistics 
    (Total talent uploads and quiz history) to populate the My Arena view.
    """
    # 🌟 FIXED: Query the full user profile data out of your live Supabase table
    user_stmt = select(UserInDb).where(UserInDb.user_id == current_user.user_id)
    user_exec = await session.execute(user_stmt)
    user_record = user_exec.scalar_one_or_none()

    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user profile context could not be located."
        )

    # 1. Fetch user's talent submission history count
    upload_stmt = select(Uploads).where(Uploads.user_id == current_user.user_id)
    upload_exec = await session.execute(upload_stmt)
    user_uploads = upload_exec.scalars().all()
    
    # 2. Fetch user's past quiz scores
    quiz_stmt = select(QuizScore).where(QuizScore.user_id == current_user.user_id)
    quiz_exec = await session.execute(quiz_stmt)
    user_scores = quiz_exec.scalars().all()
    
    # 🌟 FIXED: References full, real metadata properties straight out of user_record database model instance
    return {
        "user": {
            "user_id": user_record.user_id,
            "username": user_record.username,
            "email": user_record.email,
            "role": user_record.role.value if hasattr(user_record.role, "value") else str(user_record.role),
            "referral_code": user_record.referral_code,
            "avatar": getattr(user_record, "avatar", "")
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