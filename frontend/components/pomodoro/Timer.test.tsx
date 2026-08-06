import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import Timer from './Timer';
import useTimer from '@/hooks/use-timer';

// Create the mock
vi.mock('@/hooks/use-timer');
// Treat useTimer as mock function
const mockedUseTimer = vi.mocked(useTimer);

const mockTimer = {
    pomodoroId: '1',
    name: 'Default',
    focusTime: 1500,
    breakTime: 300,
};
const mockProps = {
    selectedTimer: mockTimer,
    incompleteTasks: [],
    selectedTask: undefined,
    onSelectTask: vi.fn(),
};

describe('Timer', () => {
    it('displays focus mode correctly', () => {
        // Fake hook return value
        mockedUseTimer.mockReturnValue({
            progress: 100,
            mode: 'focus',
            timeLeft: 1500,
            sessions: 0,
            isActive: false,
            toggleTimer: vi.fn(),
            resetTimer: vi.fn(),
            switchMode: vi.fn(),
        });

        render(<Timer {...mockProps} />);
        expect(screen.getByText('Focus Time')).toBeInTheDocument();
        expect(screen.getByText('Sessions: 0')).toBeInTheDocument();
        expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('displays break mode correctly', () => {
        mockedUseTimer.mockReturnValue({
            progress: 100,
            mode: 'break',
            timeLeft: 300,
            sessions: 1,
            isActive: false,
            toggleTimer: vi.fn(),
            resetTimer: vi.fn(),
            switchMode: vi.fn(),
        });

        render(<Timer {...mockProps} />);
        expect(screen.getByText('Break Time')).toBeInTheDocument();
        expect(screen.getByText('Sessions: 1')).toBeInTheDocument();
        expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('starts timer when Start button is clicked', async () => {
        const user = userEvent.setup();
        const toggleTimer = vi.fn();

        mockedUseTimer.mockReturnValue({
            progress: 100,
            mode: 'focus',
            timeLeft: 1500,
            sessions: 0,
            isActive: false,
            toggleTimer: toggleTimer,
            resetTimer: vi.fn(),
            switchMode: vi.fn(),
        });

        render(<Timer {...mockProps} />);

        await user.click(
            screen.getByRole('button', {
                name: 'Start',
            }),
        );
        expect(toggleTimer).toHaveBeenCalled();
    });

    it('shows Pause when timer is running', () => {
        mockedUseTimer.mockReturnValue({
            progress: 60,
            mode: 'focus',
            timeLeft: 900,
            sessions: 0,
            isActive: true,
            toggleTimer: vi.fn(),
            resetTimer: vi.fn(),
            switchMode: vi.fn(),
        });

        render(<Timer {...mockProps} />);

        expect(
            screen.getByRole('button', {
                name: 'Pause',
            }),
        ).toBeInTheDocument();
    });

    it('resets timer when Reset is clicked', async () => {
        const user = userEvent.setup();
        const resetTimer = vi.fn();

        mockedUseTimer.mockReturnValue({
            progress: 60,
            mode: 'focus',
            timeLeft: 900,
            sessions: 0,
            isActive: false,
            toggleTimer: vi.fn(),
            resetTimer: resetTimer,
            switchMode: vi.fn(),
        });

        render(<Timer {...mockProps} />);

        await user.click(
            screen.getByRole('button', {
                name: 'Reset',
            }),
        );
        expect(resetTimer).toHaveBeenCalled();
    });

    it('switches timer mode when clicked', async () => {
        const user = userEvent.setup();
        const switchMode = vi.fn();

        mockedUseTimer.mockReturnValue({
            progress: 50,
            mode: 'focus',
            timeLeft: 1000,
            sessions: 0,
            isActive: false,
            toggleTimer: vi.fn(),
            resetTimer: vi.fn(),
            switchMode,
        });

        render(<Timer {...mockProps} />);
        await user.click(
            screen.getByRole('button', {
                name: 'Switch to Break',
            }),
        );
        expect(switchMode).toHaveBeenCalled();
    });
});
