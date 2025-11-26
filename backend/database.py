from typing import List, Dict
from datetime import datetime, timedelta
from passlib.context import CryptContext
from models import User, ScoreEntry

# Password hashing for fake data
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Mock in-memory database
users: List[User] = [
    User(username="DemoUser", password=hash_password("password123"), createdAt=datetime.now() - timedelta(days=5)),
    User(username="ProGamer", password=hash_password("password123"), createdAt=datetime.now() - timedelta(days=2)),
    User(username="SnakeKing", password=hash_password("password123"), createdAt=datetime.now() - timedelta(days=10)),
]

scores: List[ScoreEntry] = [
    ScoreEntry(username="SnakeKing", score=500, date=datetime.now() - timedelta(days=1)),
    ScoreEntry(username="ProGamer", score=350, date=datetime.now() - timedelta(hours=5)),
    ScoreEntry(username="DemoUser", score=200, date=datetime.now() - timedelta(days=2)),
    ScoreEntry(username="SnakeKing", score=450, date=datetime.now() - timedelta(days=3)),
    ScoreEntry(username="ProGamer", score=100, date=datetime.now() - timedelta(days=1)),
]

def get_user(username: str) -> User | None:
    for user in users:
        if user.username == username:
            return user
    return None

def create_user(user: User) -> User:
    users.append(user)
    return user

def get_top_scores(limit: int = 10) -> List[ScoreEntry]:
    return sorted(scores, key=lambda x: x.score, reverse=True)[:limit]

def add_score(score: ScoreEntry) -> ScoreEntry:
    scores.append(score)
    return score
