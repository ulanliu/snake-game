import { describe, it, expect } from 'vitest';
import {
    GRID_SIZE,
    generateFood,
    wrapCoordinates,
    isOutOfBounds,
    checkSelfCollision,
    moveSnake,
    INITIAL_SNAKE,
    INITIAL_DIRECTION
} from './gameLogic';

describe('generateFood', () => {
    it('should generate food within grid bounds', () => {
        const snake = [{ x: 10, y: 10 }];
        const food = generateFood(snake);

        expect(food.x).toBeGreaterThanOrEqual(0);
        expect(food.x).toBeLessThan(GRID_SIZE);
        expect(food.y).toBeGreaterThanOrEqual(0);
        expect(food.y).toBeLessThan(GRID_SIZE);
    });

    it('should not generate food on snake position', () => {
        const snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
        const food = generateFood(snake);

        const onSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
        expect(onSnake).toBe(false);
    });
});

describe('wrapCoordinates', () => {
    it('should wrap negative x to right edge', () => {
        const result = wrapCoordinates({ x: -1, y: 10 });
        expect(result).toEqual({ x: GRID_SIZE - 1, y: 10 });
    });

    it('should wrap x beyond grid to left edge', () => {
        const result = wrapCoordinates({ x: GRID_SIZE, y: 10 });
        expect(result).toEqual({ x: 0, y: 10 });
    });

    it('should wrap negative y to bottom edge', () => {
        const result = wrapCoordinates({ x: 10, y: -1 });
        expect(result).toEqual({ x: 10, y: GRID_SIZE - 1 });
    });

    it('should wrap y beyond grid to top edge', () => {
        const result = wrapCoordinates({ x: 10, y: GRID_SIZE });
        expect(result).toEqual({ x: 10, y: 0 });
    });

    it('should not modify coordinates within bounds', () => {
        const result = wrapCoordinates({ x: 10, y: 10 });
        expect(result).toEqual({ x: 10, y: 10 });
    });
});

describe('isOutOfBounds', () => {
    it('should return true for negative x', () => {
        expect(isOutOfBounds({ x: -1, y: 10 })).toBe(true);
    });

    it('should return true for x beyond grid', () => {
        expect(isOutOfBounds({ x: GRID_SIZE, y: 10 })).toBe(true);
    });

    it('should return true for negative y', () => {
        expect(isOutOfBounds({ x: 10, y: -1 })).toBe(true);
    });

    it('should return true for y beyond grid', () => {
        expect(isOutOfBounds({ x: 10, y: GRID_SIZE })).toBe(true);
    });

    it('should return false for coordinates within bounds', () => {
        expect(isOutOfBounds({ x: 10, y: 10 })).toBe(false);
    });
});

describe('checkSelfCollision', () => {
    it('should return true when head collides with body', () => {
        const head = { x: 5, y: 5 };
        const body = [{ x: 5, y: 6 }, { x: 5, y: 5 }, { x: 6, y: 5 }];

        expect(checkSelfCollision(head, body)).toBe(true);
    });

    it('should return false when head does not collide with body', () => {
        const head = { x: 5, y: 5 };
        const body = [{ x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 5 }];

        expect(checkSelfCollision(head, body)).toBe(false);
    });

    it('should return false for empty body', () => {
        const head = { x: 5, y: 5 };
        const body = [];

        expect(checkSelfCollision(head, body)).toBe(false);
    });
});

describe('moveSnake', () => {
    describe('normal mode (walkThroughMode = false)', () => {
        it('should move snake forward', () => {
            const snake = [{ x: 10, y: 10 }];
            const direction = { x: 1, y: 0 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, false);

            expect(result.gameOver).toBe(false);
            expect(result.snake[0]).toEqual({ x: 11, y: 10 });
            expect(result.snake.length).toBe(1);
        });

        it('should end game when hitting wall', () => {
            const snake = [{ x: 0, y: 10 }];
            const direction = { x: -1, y: 0 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, false);

            expect(result.gameOver).toBe(true);
        });

        it('should end game on self collision', () => {
            const snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 11 }, { x: 11, y: 10 }];
            const direction = { x: 1, y: 0 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, false);

            expect(result.gameOver).toBe(true);
        });

        it('should grow snake when eating food', () => {
            const snake = [{ x: 10, y: 10 }];
            const direction = { x: 1, y: 0 };
            const food = { x: 11, y: 10 };

            const result = moveSnake(snake, direction, food, false);

            expect(result.gameOver).toBe(false);
            expect(result.ateFood).toBe(true);
            expect(result.snake.length).toBe(2);
            expect(result.snake[0]).toEqual({ x: 11, y: 10 });
        });
    });

    describe('walk-through mode (walkThroughMode = true)', () => {
        it('should wrap around when hitting left wall', () => {
            const snake = [{ x: 0, y: 10 }];
            const direction = { x: -1, y: 0 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, true);

            expect(result.gameOver).toBe(false);
            expect(result.snake[0]).toEqual({ x: GRID_SIZE - 1, y: 10 });
        });

        it('should wrap around when hitting right wall', () => {
            const snake = [{ x: GRID_SIZE - 1, y: 10 }];
            const direction = { x: 1, y: 0 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, true);

            expect(result.gameOver).toBe(false);
            expect(result.snake[0]).toEqual({ x: 0, y: 10 });
        });

        it('should wrap around when hitting top wall', () => {
            const snake = [{ x: 10, y: 0 }];
            const direction = { x: 0, y: -1 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, true);

            expect(result.gameOver).toBe(false);
            expect(result.snake[0]).toEqual({ x: 10, y: GRID_SIZE - 1 });
        });

        it('should wrap around when hitting bottom wall', () => {
            const snake = [{ x: 10, y: GRID_SIZE - 1 }];
            const direction = { x: 0, y: 1 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, true);

            expect(result.gameOver).toBe(false);
            expect(result.snake[0]).toEqual({ x: 10, y: 0 });
        });

        it('should still detect self collision in walk-through mode', () => {
            const snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 11 }, { x: 11, y: 10 }];
            const direction = { x: 1, y: 0 };
            const food = { x: 15, y: 15 };

            const result = moveSnake(snake, direction, food, true);

            expect(result.gameOver).toBe(true);
        });
    });
});
