import secrets
import string
from passlib.context import CryptContext
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr
from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer


oauth_context = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=['sha256_crypt'], deprecated="auto")


def generate_referral_code(length: int = 8) -> str:
    alphabets = "".join(
        c for c in string.ascii_uppercase + string.digits if c not in {"O", "0", "I", "1", "L"}
    )
    return "".join(secrets.choice(alphabets) for _ in range(length))


class AppSettings(BaseSettings):
    secret_key: SecretStr
    algorithm: str = "HS256"


    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = AppSettings()

def create_access_token(payload: dict) -> str:
    data = payload.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    data.update({"exp": expire})

    token =  jwt.encode(data, settings.secret_key.get_secret_value(), settings.algorithm)

    return token