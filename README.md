# 🐍 Snake Game

A modern Snake game built with React frontend and FastAPI backend.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.12 or higher) - [Download here](https://www.python.org/)
- **uv** (Python package manager) - Installation instructions below

### Installation

#### 1. Install uv (Python Package Manager)

If you don't have `uv` installed, run:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

After installation, restart your terminal or run:
```bash
source ~/.bashrc  # or ~/.zshrc depending on your shell
```

#### 2. Install Dependencies

Install all project dependencies (both frontend and backend):

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
uv sync
cd ..
```

### Running the Application

#### Option 1: Run Both Frontend and Backend Together (Recommended)

From the root directory, run:

```bash
npm run dev
```

This will start:
- **Frontend** at http://localhost:5173/
- **Backend** at http://127.0.0.1:8000

#### Option 2: Run Frontend and Backend Separately

**Terminal 1 - Frontend:**
```bash
npm run dev:frontend
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

## 📁 Project Structure

```
snake-game/
├── frontend/          # React + Vite frontend
│   ├── src/          # Source files
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # FastAPI backend
│   ├── main.py       # Main application file
│   ├── Makefile      # Backend commands
│   └── pyproject.toml # Python dependencies
└── package.json      # Root package with dev scripts
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Frontend Tests Only

```bash
npm run test:frontend
```

### Run Backend Tests Only

```bash
npm run test:backend
```

## 🛠️ Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm test` - Run all tests
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests

### Frontend (in `frontend/` directory)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code

### Backend (in `backend/` directory)

- `make run` - Start FastAPI server
- `make test` - Run pytest tests
- `make install` - Install dependencies
- `make clean` - Clean cache files

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Pytest** - Testing framework
- **JWT** - Authentication
- **Passlib** - Password hashing

## 📝 API Documentation

Once the backend is running, you can access:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **OpenAPI JSON**: http://127.0.0.1:8000/openapi.json

## 🐛 Troubleshooting

### `uv: command not found`

Make sure `uv` is installed and in your PATH:
```bash
which uv
```

If not found, install it using the command in the Prerequisites section.

### `vite: not found`

Install frontend dependencies:
```bash
cd frontend
npm install
```

### Port Already in Use

If ports 5173 or 8000 are already in use, you can:
- Stop the process using that port
- Or modify the port in the respective config files

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Gaming! 🎮**
