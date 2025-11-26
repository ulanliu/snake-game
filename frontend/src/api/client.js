// Simulated API Client

const DELAY = 500; // Simulate network delay

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, DELAY));

// Local storage keys
const USERS_KEY = 'snake_game_users';
const SCORES_KEY = 'snake_game_scores';

// Helper to get data from local storage
const getStoredData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

// Helper to set data to local storage
const setStoredData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const auth = {
    login: async (username) => {
        await simulateDelay();
        const users = getStoredData(USERS_KEY);
        const user = users.find(u => u.username === username);

        if (!user) {
            throw new Error('User not found');
        }

        return { username: user.username, token: 'fake-jwt-token' };
    },

    signup: async (username) => {
        await simulateDelay();
        const users = getStoredData(USERS_KEY);

        if (users.some(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        const newUser = { username, createdAt: new Date().toISOString() };
        users.push(newUser);
        setStoredData(USERS_KEY, users);

        return { username: newUser.username, token: 'fake-jwt-token' };
    }
};

export const leaderboard = {
    getTopScores: async (limit = 10) => {
        await simulateDelay();
        const scores = getStoredData(SCORES_KEY);
        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    submitScore: async (username, score) => {
        await simulateDelay();
        const scores = getStoredData(SCORES_KEY);
        const newScore = { username, score, date: new Date().toISOString() };
        scores.push(newScore);
        setStoredData(SCORES_KEY, scores);
        return newScore;
    }
};
