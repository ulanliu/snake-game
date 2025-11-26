from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, leaderboard

app = FastAPI(
    title="Snake Game API",
    description="API for Snake Game User System and Leaderboard",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Snake Game API is running"}
