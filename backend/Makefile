.PHONY: run test clean install

# Run the backend server in development mode
run:
	uv run uvicorn main:app --reload

# Run tests
test:
	uv run pytest

# Install dependencies
install:
	uv sync

# Clean up cache files
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
