// Game constants
export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SNAKE = [{ x: 10, y: 10 }];
export const INITIAL_DIRECTION = { x: 1, y: 0 };
export const GAME_SPEED = 150;

/**
 * Generate a random food position that doesn't overlap with the snake
 * @param {Array} snake - Current snake segments
 * @returns {Object} Food position {x, y}
 */
export function generateFood(snake) {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

/**
 * Wrap coordinates around the grid boundaries
 * @param {Object} position - Position to wrap {x, y}
 * @returns {Object} Wrapped position {x, y}
 */
export function wrapCoordinates(position) {
    const wrapped = { ...position };
    if (wrapped.x < 0) wrapped.x = GRID_SIZE - 1;
    if (wrapped.x >= GRID_SIZE) wrapped.x = 0;
    if (wrapped.y < 0) wrapped.y = GRID_SIZE - 1;
    if (wrapped.y >= GRID_SIZE) wrapped.y = 0;
    return wrapped;
}

/**
 * Check if position is out of bounds
 * @param {Object} position - Position to check {x, y}
 * @returns {boolean} True if out of bounds
 */
export function isOutOfBounds(position) {
    return (
        position.x < 0 ||
        position.x >= GRID_SIZE ||
        position.y < 0 ||
        position.y >= GRID_SIZE
    );
}

/**
 * Check if snake collides with itself
 * @param {Object} head - Snake head position {x, y}
 * @param {Array} body - Snake body segments (excluding head)
 * @returns {boolean} True if collision detected
 */
export function checkSelfCollision(head, body) {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
}

/**
 * Move the snake in the current direction
 * @param {Array} snake - Current snake segments
 * @param {Object} direction - Movement direction {x, y}
 * @param {Object} food - Food position {x, y}
 * @param {boolean} walkThroughMode - Whether walk-through mode is enabled
 * @returns {Object} Result {snake, gameOver, ateFood}
 */
export function moveSnake(snake, direction, food, walkThroughMode) {
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Handle wall collision or wrap around
    if (walkThroughMode) {
        const wrapped = wrapCoordinates(newHead);
        newHead.x = wrapped.x;
        newHead.y = wrapped.y;
    } else {
        if (isOutOfBounds(newHead)) {
            return { snake, gameOver: true, ateFood: false };
        }
    }

    // Check self collision
    if (checkSelfCollision(newHead, snake)) {
        return { snake, gameOver: true, ateFood: false };
    }

    const newSnake = [newHead, ...snake];

    // Check food collision
    const ateFood = newHead.x === food.x && newHead.y === food.y;
    if (!ateFood) {
        newSnake.pop();
    }

    return { snake: newSnake, gameOver: false, ateFood };
}
