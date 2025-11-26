from fastapi import APIRouter, HTTPException, status
from datetime import datetime
import jwt
from passlib.context import CryptContext
from models import User, UserCreate, AuthResponse, Error
from database import get_user, create_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = "supersecretkey"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_token(username: str) -> str:
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm="HS256")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, responses={409: {"model": Error}})
async def signup(user_data: UserCreate):
    if get_user(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        username=user_data.username,
        password=hashed_password,
        createdAt=datetime.now()
    )
    create_user(new_user)
    
    token = create_token(new_user.username)
    return AuthResponse(username=new_user.username, token=token)

@router.post("/login", response_model=AuthResponse, responses={401: {"model": Error}, 404: {"model": Error}})
async def login(user_data: UserCreate):
    user = get_user(user_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    token = create_token(user.username)
    return AuthResponse(username=user.username, token=token)
