from typing import Annotated
from fastapi import APIRouter, Depends, status, HTTPException
from schemas.user import UserCreate, UserInDb, UserResponse
from services.auth import create_access_token, pwd_context, generate_referral_code, oauth_context
from services.db import get_async_session
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

auth_router = APIRouter(prefix="/auth", tags=["Authentication and Registration"])


@auth_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, session: AsyncSession = Depends(get_async_session)):

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
    
    token_payload = {"sub": user.user_id}

    token = create_access_token(token_payload)

    return {"access_token": token, "token_type": "bearer"}

