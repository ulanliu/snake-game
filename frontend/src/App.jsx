import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GRID_SIZE,
  CELL_SIZE,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  GAME_SPEED,
  generateFood as generateFoodLogic,
  moveSnake as moveSnakeLogic
} from './gameLogic';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { leaderboard } from './api/client';
import AuthModal from './components/AuthModal';
import Leaderboard from './components/Leaderboard';

function GameContent() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [walkThroughMode, setWalkThroughMode] = useState(false);

  // UI State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const { user, logout } = useAuth();
  const scoreSubmittedRef = useRef(false);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#030712'; // gray-950
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f3f4f6'; // gray-100
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleWalkThroughMode = () => {
    setWalkThroughMode(prev => !prev);
  };

  const generateFood = useCallback(() => {
    return generateFoodLogic(snake);
  }, [snake]);

  const handleGameOver = useCallback(async (finalScore) => {
    setGameOver(true);
    // Only submit score once per game session
    if (user && finalScore > 0 && !scoreSubmittedRef.current) {
      scoreSubmittedRef.current = true;
      try {
        await leaderboard.submitScore(user.username, finalScore);
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }
  }, [user]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    scoreSubmittedRef.current = false; // Reset submission flag
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const result = moveSnakeLogic(prevSnake, direction, food, walkThroughMode);

      if (result.gameOver) {
        handleGameOver(score);
        return prevSnake;
      }

      if (result.ateFood) {
        const newScore = score + 10;
        setScore(newScore);
        setFood(generateFood());
      }

      return result.snake;
    });
  }, [direction, food, gameOver, isPaused, walkThroughMode, generateFood, score, handleGameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver && e.key !== 'Enter') return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-10 max-w-2xl w-full transition-colors duration-300">

        {/* Header with User Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  👤 {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
          >
            🏆 Leaderboard
          </button>
        </div>

        <div className="flex justify-between items-center mb-8 gap-8">
          <h1 className="text-5xl font-bold text-green-600 dark:text-white">Snake Game</h1>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={toggleWalkThroughMode}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${walkThroughMode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {walkThroughMode ? '🚪 Walk-Through ON' : '🚪 Walk-Through OFF'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold text-gray-700 dark:text-white">
            Score: <span className="text-green-600 dark:text-white">{score}</span>
          </div>
          {isPaused && !gameOver && (
            <div className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">PAUSED</div>
          )}
          {gameOver && (
            <div className="text-xl font-semibold text-red-600 dark:text-red-400">GAME OVER</div>
          )}
        </div>

        <div className="flex justify-center mb-4">
          <div
            className="relative outline outline-4 outline-green-600 dark:outline-white bg-white dark:bg-gray-900 transition-colors duration-300"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
              backgroundImage: `
                linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 1px, transparent 1px),
                linear-gradient(to bottom, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
            }}
          >
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute rounded-sm"
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  backgroundColor: index === 0 ? '#15803d' : '#22c55e'
                }}
              />
            ))}

            <div
              className="absolute rounded-full"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: '#ef4444'
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={resetGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {gameOver ? 'Play Again' : 'Restart Game'}
          </button>

          <div className="text-center text-sm text-gray-600 dark:text-white">
            <p>Use arrow keys to move</p>
            <p>Press SPACE to pause</p>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameContent />
    </AuthProvider>
  );
}