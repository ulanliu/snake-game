import React, { useEffect, useState } from 'react';
import { leaderboard } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard({ isOpen, onClose }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen) {
            loadScores();
        }
    }, [isOpen]);

    const loadScores = async () => {
        setLoading(true);
        try {
            const data = await leaderboard.getTopScores();
            setScores(data);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Leaderboard
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>
                ) : (
                    <div className="space-y-2">
                        {scores.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400">No scores yet!</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                        <th className="pb-2">Rank</th>
                                        <th className="pb-2">Player</th>
                                        <th className="pb-2 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scores.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className={`
                        ${user && user.username === entry.username ? 'bg-green-50 dark:bg-green-900/20' : ''}
                        border-b border-gray-100 dark:border-gray-800 last:border-0
                      `}
                                        >
                                            <td className="py-3 text-gray-600 dark:text-gray-300 font-medium">
                                                #{index + 1}
                                            </td>
                                            <td className="py-3 text-gray-800 dark:text-white font-semibold">
                                                {entry.username}
                                                {user && user.username === entry.username && ' (You)'}
                                            </td>
                                            <td className="py-3 text-right text-green-600 dark:text-green-400 font-bold">
                                                {entry.score}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
