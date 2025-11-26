const API_URL = 'http://localhost:8000/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'API request failed');
    }
    return response.json();
};

export const auth = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return handleResponse(response);
    },

    signup: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return handleResponse(response);
    }
};

export const leaderboard = {
    getTopScores: async (limit = 10) => {
        const response = await fetch(`${API_URL}/leaderboard?limit=${limit}`);
        return handleResponse(response);
    },

    submitScore: async (username, score) => {
        // Get token from localStorage (managed by AuthContext)
        const storedUser = localStorage.getItem('snake_game_current_user');
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ score }),
        });
        return handleResponse(response);
    }
};
