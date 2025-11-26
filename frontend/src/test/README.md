# Frontend Test Configuration

This directory contains configuration files for the frontend testing environment.

## Files

- `setup.js`: Configures Vitest and React Testing Library (e.g., extending `expect` with `jest-dom` matchers).

## Running Tests

To run the frontend tests, execute the following command from the `frontend` directory:

```bash
npm test
```

To run tests with a UI:

```bash
npm run test:ui
```

## Test Files

- `src/gameLogic.test.js`: Unit tests for core game logic.
- `src/App.test.jsx`: Component tests for the React application.
