from fastapi.testclient import TestClient
from main import app
from database import users, scores

client = TestClient(app)

def setup_function():
    # Clear mock DB before each test
    users.clear()
    scores.clear()

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Snake Game API is running"}

def test_signup():
    response = client.post("/api/auth/signup", json={"username": "testuser"})
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert "token" in data

def test_signup_duplicate():
    client.post("/api/auth/signup", json={"username": "testuser"})
    response = client.post("/api/auth/signup", json={"username": "testuser"})
    assert response.status_code == 409

def test_login():
    client.post("/api/auth/signup", json={"username": "testuser"})
    response = client.post("/api/auth/login", json={"username": "testuser"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "token" in data

def test_login_not_found():
    response = client.post("/api/auth/login", json={"username": "nonexistent"})
    assert response.status_code == 404

def test_submit_score():
    # Signup and get token
    auth_response = client.post("/api/auth/signup", json={"username": "player1"})
    token = auth_response.json()["token"]
    
    # Submit score
    response = client.post(
        "/api/leaderboard",
        json={"score": 100},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "player1"
    assert data["score"] == 100

def test_get_leaderboard():
    # Create users and scores
    token1 = client.post("/api/auth/signup", json={"username": "p1"}).json()["token"]
    token2 = client.post("/api/auth/signup", json={"username": "p2"}).json()["token"]
    
    client.post("/api/leaderboard", json={"score": 100}, headers={"Authorization": f"Bearer {token1}"})
    client.post("/api/leaderboard", json={"score": 200}, headers={"Authorization": f"Bearer {token2}"})
    
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["username"] == "p2"  # Higher score first
    assert data[0]["score"] == 200
    assert data[1]["username"] == "p1"
    assert data[1]["score"] == 100
