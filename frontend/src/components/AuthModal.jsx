
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required');
            return;
        }

        try {
            if (isLogin) {
                await login(username, password);
            } else {
                await signup(username, password);
            }
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
