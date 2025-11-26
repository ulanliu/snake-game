# Backend Tests

This directory contains integration tests for the Snake Game API.

## Prerequisites

- Python 3.12+
- `uv` package manager

## Running Tests

To run the tests, execute the following command from the `backend` directory:

```bash
uv run pytest
```

## Test Coverage

The tests cover the following functionality:

- **Authentication**:
  - Signup (success, duplicate username)
  - Login (success, incorrect password, user not found)
  - Password hashing and verification
- **Leaderboard**:
  - Submit score (authenticated)
  - Get top scores
