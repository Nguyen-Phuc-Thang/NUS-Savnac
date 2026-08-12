import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import PickTaskDialog from './PickTaskDialog';

const mockTasks = [
    {
        taskId: '1',
        name: 'Problem Set 3',
        course: {
            courseCode: 'CS2030S',
        },
    },
    {
        taskId: '2',
        name: 'Problem Set 6',
        course: {
            courseCode: 'CS2040S',
        },
    },
];

describe('Pick Task Dialog', () => {
    it('shows Select Your Task when no task is selected', () => {
        render(
            <PickTaskDialog
                incompleteTasks={mockTasks}
                selectedTask={undefined}
                onSelectTask={vi.fn()}
            />,
        );

        expect(screen.getByText('Select Your Task')).toBeInTheDocument();
    });

    it('opens dialog when button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <PickTaskDialog
                incompleteTasks={mockTasks}
                selectedTask={undefined}
                onSelectTask={vi.fn()}
            />,
        );

        await user.click(screen.getByText('Select Your Task'));
        expect(
            screen.getByText('Choose a task to focus on during this session.'),
        ).toBeInTheDocument();
    });

    it('displays incomplete tasks', async () => {
        const user = userEvent.setup();

        render(
            <PickTaskDialog
                incompleteTasks={mockTasks}
                selectedTask={undefined}
                onSelectTask={vi.fn()}
            />,
        );

        await user.click(screen.getByText('Select Your Task'));
        expect(screen.getByText('CS2030S - Problem Set 3')).toBeInTheDocument();
        expect(screen.getByText('CS2040S - Problem Set 6')).toBeInTheDocument();
    });

    it('selects a task when clicked', async () => {
        const user = userEvent.setup();
        const onSelectTask = vi.fn();

        render(
            <PickTaskDialog
                incompleteTasks={mockTasks}
                selectedTask={undefined}
                onSelectTask={onSelectTask}
            />,
        );

        await user.click(screen.getByText('Select Your Task'));
        await user.click(screen.getByText('CS2030S - Problem Set 3'));
        expect(onSelectTask).toHaveBeenCalledWith(mockTasks[0]);
    });

    it('clears selected task', async () => {
        const user = userEvent.setup();
        const onSelectTask = vi.fn();

        render(
            <PickTaskDialog
                incompleteTasks={mockTasks}
                selectedTask={mockTasks[0]}
                onSelectTask={onSelectTask}
            />,
        );

        const clearButton = screen.getByRole('button', {
            name: 'Clear selected task',
        });

        await user.click(clearButton);
        expect(onSelectTask).toHaveBeenCalledWith(undefined);
    });
});
