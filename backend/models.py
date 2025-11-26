from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class User(BaseModel):
    username: str
    createdAt: datetime

class UserCreate(BaseModel):
    username: str

class AuthResponse(BaseModel):
    username: str
    token: str

class ScoreEntry(BaseModel):
    username: str
    score: int
    date: datetime

class ScoreSubmission(BaseModel):
    score: int

class Error(BaseModel):
    message: str
