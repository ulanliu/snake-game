import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for persisted user on mount
        const storedUser = localStorage.getItem('snake_game_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username) => {
        setLoading(true);
        setError(null);
        try {
            const data = await auth.login(username);
            setUser(data);
            localStorage.setItem('snake_game_current_user', JSON.stringify(data));
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (username) => {
        setLoading(true);
        setError(null);
        try {
            const data = await auth.signup(username);
            setUser(data);
            localStorage.setItem('snake_game_current_user', JSON.stringify(data));
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('snake_game_current_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
