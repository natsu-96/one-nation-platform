from fastapi import FastAPI, Depends
from services.db import init_db, get_async_session
from routers.auth import auth_router
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_async_session)):
    return {"status": "healthy", "database": "async_sqlite_active"}