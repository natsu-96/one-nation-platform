from app.schemas.user import UserInDb
from app.schemas.uploads import Uploads
from app.schemas.votes import Votes
from app.schemas.quiz import QuizQuestion
from app.schemas.quiz import QuizSession
from app.schemas.quiz import QuizScore
from app.schemas.nominees import Nominee
from app.schemas.nominees import CompendiumVotes
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from .auth import settings


DB_URL = settings.db_url

is_sqlite = DB_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

async_engine = create_async_engine(
    DB_URL, echo=False, future=True, connect_args=connect_args
)

async def get_async_session() -> AsyncSession:
    async_session = sessionmaker(async_engine, class_=AsyncSession,
                                 expire_on_commit=False)

    async with async_session() as session:
        yield session

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)