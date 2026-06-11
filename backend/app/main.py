import cloudinary
from fastapi import FastAPI, Depends
from services.db import init_db, get_async_session
from services.auth import settings
from services.limiter import limiter
from routers.auth import auth_router
from routers.uploads import uploads_router
from routers.leaderboard import leaderboard_router
from routers.votes import votes_router
from routers.nominee import nominees_router
from routers.quiz import quiz_router
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded



@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    cloudinary.config(
    cloud_name = settings.cloudinary_name,
    api_key = settings.cloudinary_key,
    api_secret = settings.api_secret,
    secure=True
)
    
    yield

app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth_router)
app.include_router(uploads_router)
app.include_router(leaderboard_router)
app.include_router(votes_router)
app.include_router(quiz_router)
app.include_router(nominees_router)

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_async_session)):
    return {"status": "healthy", "database": "async_sqlite_active"}