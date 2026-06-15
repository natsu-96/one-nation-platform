from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status, Depends
from app.schemas.user import CurrentUser
from .auth import Scopes, Require_scope

MIN_ACCOUNT_AGE = 24

async def verify_account_age(
        current_user: CurrentUser = Depends(Require_scope(Scopes.VOTE_CAST)),
) -> CurrentUser:
    """
    Checks if the user account is old enough to vote
    """
    now = datetime.now(timezone.utc)
    account_age = now - current_user.created_at

    if account_age < timedelta(hours=MIN_ACCOUNT_AGE):
        hours_remaining = MIN_ACCOUNT_AGE - (account_age.total_seconds()/3600)

        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail=f"Anti-spam protection: Your account must be 24 hours old to vote, you have {hours_remaining} hours left"
            )
    
    return current_user