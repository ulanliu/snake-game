from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime
from typing import List
from models import ScoreEntry, ScoreSubmission, Error
from database import get_top_scores, add_score, get_user

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])
security = HTTPBearer()

SECRET_KEY = "supersecretkey"

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@router.get("", response_model=List[ScoreEntry])
async def get_scores(limit: int = 10):
    return get_top_scores(limit)

@router.post("", response_model=ScoreEntry, status_code=status.HTTP_201_CREATED)
async def submit_score(submission: ScoreSubmission, username: str = Depends(get_current_user)):
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    new_score = ScoreEntry(
        username=username,
        score=submission.score,
        date=datetime.now()
    )
    add_score(new_score)
    return new_score
