import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import TimerCard from './TimerCard';

const mockTimer = {
    pomodoroId: '1',
    name: 'Default',
    focusTime: 1500,
    breakTime: 300,
};

describe('Timer Card', () => {
    it('displays timer details', () => {
        render(
            <TimerCard
                timer={mockTimer}
                selected={false}
                onClick={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        expect(screen.getByText('Default')).toBeInTheDocument();
        expect(screen.getByText('Focus: 25m')).toBeInTheDocument();
        expect(screen.getByText('Break: 5m')).toBeInTheDocument();
    });

    it('shows check icon when selected', () => {
        const { container } = render(
            <TimerCard
                timer={mockTimer}
                selected={true}
                onClick={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('calls onClick when timer card is clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <TimerCard
                timer={mockTimer}
                selected={false}
                onClick={onClick}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        await user.click(screen.getByText('Default'));
        expect(onClick).toHaveBeenCalled();
    });

    it('opens edit timer dialog when edit button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <TimerCard
                timer={mockTimer}
                selected={false}
                onClick={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={vi.fn()}
                canDeleteTimer={true}
            />,
        );

        await user.click(
            screen.getByRole('button', {
                name: 'Edit Timer',
            }),
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Edit Timer')).toBeInTheDocument();
    });

    it('deletes timer after confirmation', async () => {
        const user = userEvent.setup();
        const onDeleteTimer = vi.fn();

        render(
            <TimerCard
                timer={mockTimer}
                selected={false}
                onClick={vi.fn()}
                onEditTimer={vi.fn()}
                onDeleteTimer={onDeleteTimer}
                canDeleteTimer={true}
            />,
        );

        await user.click(
            screen.getByRole('button', {
                name: 'Delete Timer',
            }),
        );
        await user.click(
            screen.getByRole('button', {
                name: 'Delete',
            }),
        );
        expect(onDeleteTimer).toHaveBeenCalledWith('1');
    });
});
