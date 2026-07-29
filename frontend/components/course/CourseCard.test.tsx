import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CourseCard from './CourseCard';

describe('Course Card', () => {
    it('renders course code and title', () => {
        render(
            <CourseCard
                courseCode="CS1101S"
                title="Programming Methodology"
                tasks={[]}
            />,
        );

        expect(screen.getByText('CS1101S')).toBeInTheDocument();
        expect(screen.getByText('Programming Methodology')).toBeInTheDocument();
    });

    it('displays correct progress and text based on tasks', () => {
        render(
            <CourseCard
                courseCode="CS1101S"
                title="Programming Methodology"
                tasks={[
                    { id: 1, completed: true },
                    { id: 2, completed: false },
                ]}
            />,
        );

        expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('displays 0% progress and "0/0" text when there are no tasks', () => {
        render(
            <CourseCard
                courseCode="CS1101S"
                title="Programming Methodology"
                tasks={[]}
            />,
        );

        expect(screen.getByText('No tasks')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <CourseCard
                courseCode="CS1101S"
                title="Programming Methodology"
                tasks={[]}
                onClick={handleClick}
            />,
        );

        await user.click(screen.getByRole('button'));

        expect(handleClick).toHaveBeenCalledOnce();
    });
});
