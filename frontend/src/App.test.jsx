import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('SnakeGame Component', () => {
    it('should render the game title', () => {
        render(<App />);
        expect(screen.getByText('Snake Game')).toBeInTheDocument();
    });

    it('should render the game board', () => {
        const { container } = render(<App />);
        const gameBoard = container.querySelector('.relative.outline');
        expect(gameBoard).toBeInTheDocument();
    });

    it('should render control instructions', () => {
        render(<App />);
        expect(screen.getByText('Use arrow keys to move')).toBeInTheDocument();
        expect(screen.getByText('Press SPACE to pause')).toBeInTheDocument();
    });

    it('should render theme toggle button', () => {
        render(<App />);
        const themeButton = screen.getByRole('button', { name: /☀️|🌙/ });
        expect(themeButton).toBeInTheDocument();
    });

    it('should render walk-through mode toggle button', () => {
        render(<App />);
        const walkThroughButton = screen.getByRole('button', { name: /Walk-Through/ });
        expect(walkThroughButton).toBeInTheDocument();
    });

    it('should toggle walk-through mode when button is clicked', () => {
        render(<App />);
        const walkThroughButton = screen.getByRole('button', { name: /Walk-Through OFF/ });

        fireEvent.click(walkThroughButton);

        expect(screen.getByRole('button', { name: /Walk-Through ON/ })).toBeInTheDocument();
    });

    it('should toggle theme when theme button is clicked', () => {
        render(<App />);
        const themeButton = screen.getByRole('button', { name: /☀️/ });

        fireEvent.click(themeButton);

        expect(screen.getByRole('button', { name: /🌙/ })).toBeInTheDocument();
    });

    it('should display initial score of 0', () => {
        render(<App />);
        expect(screen.getByText(/Score:/)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should render restart button', () => {
        render(<App />);
        const restartButton = screen.getByRole('button', { name: /Restart Game/ });
        expect(restartButton).toBeInTheDocument();
    });

    it('should reset game when restart button is clicked', () => {
        render(<App />);
        const restartButton = screen.getByRole('button', { name: /Restart Game/ });

        fireEvent.click(restartButton);

        // Game should still be running after reset
        expect(screen.getByText(/Score:/)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
