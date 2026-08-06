import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import SetTimerDialog from './SetTimerDialog';

describe('Set Timer Dialog', () => {
    it('opens add timer dialog', async () => {
        const user = userEvent.setup();

        render(<SetTimerDialog mode="add" onTimerSubmit={vi.fn()} />);

        await user.click(
            screen.getByRole('button', {
                name: 'Add Timer',
            }),
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('shows default values when adding timer', async () => {
        const user = userEvent.setup();

        render(<SetTimerDialog mode="add" onTimerSubmit={vi.fn()} />);

        await user.click(
            screen.getByRole('button', {
                name: 'Add Timer',
            }),
        );
        expect(screen.getByDisplayValue('25')).toBeInTheDocument();
        expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    });

    it('loads existing timer data in edit mode', async () => {
        const user = userEvent.setup();
        const timer = {
            pomodoroId: '1',
            name: 'Default',
            focusTime: 1500,
            breakTime: 300,
        };

        render(
            <SetTimerDialog
                mode="edit"
                timer={timer}
                onTimerSubmit={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole('button', {
                name: 'Edit Timer',
            }),
        );
        expect(screen.getByDisplayValue('Default')).toBeInTheDocument();
        expect(screen.getByDisplayValue('25')).toBeInTheDocument();
        expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    });

    it('submits timer data correctly', async () => {
        const user = userEvent.setup();
        const onTimerSubmit = vi.fn();

        render(<SetTimerDialog mode="add" onTimerSubmit={onTimerSubmit} />);

        await user.click(
            screen.getByRole('button', {
                name: 'Add Timer',
            }),
        );
        await user.type(screen.getByLabelText('Name'), 'Default');
        await user.click(
            screen.getByRole('button', {
                name: 'Save',
            }),
        );
        expect(onTimerSubmit).toHaveBeenCalledWith({
            name: 'Default',
            focusMinutes: 25,
            focusSeconds: 0,
            breakMinutes: 5,
            breakSeconds: 0,
        });
    });

    it('closes dialog when cancel is clicked', async () => {
        const user = userEvent.setup();

        render(<SetTimerDialog mode="add" onTimerSubmit={vi.fn()} />);

        await user.click(
            screen.getByRole('button', {
                name: 'Add Timer',
            }),
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.click(
            screen.getByRole('button', {
                name: 'Cancel',
            }),
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
