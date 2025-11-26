from typing import List, Dict
from models import User, ScoreEntry

# Mock in-memory database
users: List[User] = []
scores: List[ScoreEntry] = []

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
