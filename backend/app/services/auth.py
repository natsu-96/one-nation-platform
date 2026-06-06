import secrets
import string
import os
import uuid
from passlib.context import CryptContext
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr
from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from enum import StrEnum
from schemas.user import Roles, UserInDb, CurrentUser

load_dotenv()

oauth_context = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=['sha256_crypt'], deprecated="auto")


class AppSettings(BaseSettings):
    secret_key: SecretStr = os.getenv("SECRET_KEY")
    algorithm: str = "HS256"
    cloudinary_name: str = os.getenv("CLOUDINARY_NAME")
    cloudinary_key: str = os.getenv("CLOUDINARY_KEY")
    api_secret: str = os.getenv("API_SECRET")


    model_config = SettingsConfigDict(env_file="app/.env", env_file_encoding="utf-8")


class Scopes(StrEnum):
    # --- PROFILE TIER ---
    PROFILE_READ = "profile:read"
    PROFILE_WRITE = "profile:write"

    # --- MEDIA TIER ---
    MEDIA_UPLOAD = "media:upload"
    MEDIA_READ = "media:read"
    MEDIA_DELETE_OWN = "media:delete_own"
    MEDIA_DELETE_ANY = "media:delete_any"

    # --- VOTES TIER ---
    VOTE_READ = "vote:read"
    VOTE_CAST = "vote:cast"

    # --- QUIZZES TIER ---
    QUIZ_TAKE = "quiz:take"
    QUIZ_DELETE = "quiz:delete" 
    QUIZ_UPLOAD = "quiz:upload" # Creating quizzes
    QUIZ_LEADERBOARD = "quiz:leaderboard"

ROLE_PERMISSIONS = {
    Roles.USER : [Scopes.PROFILE_READ, Scopes.PROFILE_WRITE, Scopes.MEDIA_DELETE_OWN, Scopes.MEDIA_READ, Scopes.MEDIA_UPLOAD, Scopes.QUIZ_LEADERBOARD, Scopes.QUIZ_TAKE, Scopes.VOTE_CAST, Scopes.VOTE_READ],
    Roles.MODERATOR: [Scopes.PROFILE_READ, Scopes.PROFILE_WRITE, Scopes.MEDIA_DELETE_OWN, Scopes.MEDIA_READ, Scopes.MEDIA_UPLOAD, Scopes.MEDIA_DELETE_ANY, Scopes.QUIZ_LEADERBOARD, Scopes.QUIZ_TAKE, Scopes.QUIZ_DELETE, Scopes.VOTE_CAST, Scopes.VOTE_READ],
    Roles.ADMIN: [scope for scope in Scopes]
}       

settings = AppSettings()

def generate_referral_code(length: int = 8) -> str:
    alphabets = "".join(
        c for c in string.ascii_uppercase + string.digits if c not in {"O", "0", "I", "1", "L"}
    )
    return "".join(secrets.choice(alphabets) for _ in range(length))



def create_access_token(payload: dict) -> str:
    data = payload.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    data.update({"exp": expire,})

    token =  jwt.encode(data, settings.secret_key.get_secret_value(), settings.algorithm)

    return token


def get_current_user(token: str = Depends(oauth_context)) -> CurrentUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid credentials",
        headers={"WWW-Authenticate":"Bearer"}
    )
    try:
        payload = jwt.decode(token, settings.secret_key.get_secret_value(), settings.algorithm)
        role = payload.get("role")
        user_id = uuid.UUID(payload.get("sub"))

        if user_id is None or role is None:
            raise credentials_exception
        
        try:
            user_role = Roles(role)
        except ValueError:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    return CurrentUser(user_id=user_id, role=user_role)



class Require_scope:
    def __init__(self, required_scope: Scopes):
        self.required_scope = required_scope
    
    def __call__(self, current_user: UserInDb = Depends(get_current_user)):
        allowed_scopes = ROLE_PERMISSIONS.get(current_user.role, [])

        if self.required_scope not in allowed_scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=professors_only_msg(self.required_scope)
            )
        
        return current_user
    
def professors_only_msg(scope: Scopes):
    return f"Action forbidden. Requires '{scope.value}' permission"