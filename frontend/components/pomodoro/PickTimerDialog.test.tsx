import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import PickTimerDialog from './PickTimerDialog';

const mockTimers = [
    {
        pomodoroId: '1',
        name: 'Study Timer',
        focusTime: 1500,
        breakTime: 300,
    },
    {
        pomodoroId: '2',
        name: 'Short Timer',
        focusTime: 600,
        breakTime: 60,
    },
];

describe('Pick Timer Dialog', () => {
    it('shows Pick Timer when no timer is selected', () => {
        render(
            <PickTimerDialog
                timers={mockTimers}
                selectedTimer={undefined}
                onSelectTimer={vi.fn()}
                onAddTimer={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        expect(screen.getByText('Pick Timer')).toBeInTheDocument();
    });

    it('shows selected timer name', () => {
        render(
            <PickTimerDialog
                timers={mockTimers}
                selectedTimer={mockTimers[0]}
                onSelectTimer={vi.fn()}
                onAddTimer={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        expect(screen.getByText('Study Timer')).toBeInTheDocument();
    });

    it('opens dialog when button is clicked and timer selected', async () => {
        const user = userEvent.setup();

        render(
            <PickTimerDialog
                timers={mockTimers}
                selectedTimer={mockTimers[0]}
                onSelectTimer={vi.fn()}
                onAddTimer={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        await user.click(screen.getByText(mockTimers[0].name));
        expect(screen.getByText('Pick Your Timer')).toBeInTheDocument();
    });

    it('displays timers inside dialog', async () => {
        const user = userEvent.setup();

        render(
            <PickTimerDialog
                timers={mockTimers}
                selectedTimer={undefined}
                onSelectTimer={vi.fn()}
                onAddTimer={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        await user.click(screen.getByText('Pick Timer'));
        expect(screen.getByText('Study Timer')).toBeInTheDocument();
        expect(screen.getByText('Short Timer')).toBeInTheDocument();
    });

    it('selects a timer when clicked', async () => {
        const user = userEvent.setup();
        const onSelectTimer = vi.fn();

        render(
            <PickTimerDialog
                timers={mockTimers}
                selectedTimer={undefined}
                onSelectTimer={onSelectTimer}
                onAddTimer={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        await user.click(screen.getByText('Pick Timer'));
        await user.click(screen.getByText('Short Timer'));
        expect(onSelectTimer).toHaveBeenCalledWith(mockTimers[1]);
    });
});
