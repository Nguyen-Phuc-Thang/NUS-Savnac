import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AddNUSCourseDialog from './AddNUSCourseDialog';

const mockCourses = [
    {
        moduleCode: 'CS1010S',
        title: 'Programming Methodology',
    },
    {
        moduleCode: 'CS2040S',
        title: 'Data Structures and Algorithms',
    },
    {
        moduleCode: 'CS2100',
        title: 'Computer Organisation',
    },
    {
        moduleCode: 'MA1521',
        title: 'Calculus for Computing',
    },
];

describe('AddNUSCourseDialog', () => {
    it('does not display the dialog when open is false', () => {
        render(
            <AddNUSCourseDialog
                open={false}
                onOpenChange={vi.fn()}
                nusCourses={mockCourses}
                onCourseClick={vi.fn()}
            />,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        expect(screen.queryByText('Add NUS Course')).not.toBeInTheDocument();
    });

    it('displays the dialog and all courses when open is true', () => {
        render(
            <AddNUSCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                nusCourses={mockCourses}
                onCourseClick={vi.fn()}
            />,
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Add NUS Course',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'CS1010S Programming Methodology',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'CS2040S Data Structures and Algorithms',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'CS2100 Computer Organisation',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'MA1521 Calculus for Computing',
            }),
        ).toBeInTheDocument();
    });

    it('filters courses according to the entered module code', async () => {
        const user = userEvent.setup();

        render(
            <AddNUSCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                nusCourses={mockCourses}
                onCourseClick={vi.fn()}
            />,
        );

        const searchInput = screen.getByPlaceholderText(
            'Search by course code (e.g. CS1010)',
        );

        await user.type(searchInput, 'CS20');

        expect(
            screen.getByRole('button', {
                name: 'CS2040S Data Structures and Algorithms',
            }),
        ).toBeInTheDocument();

        expect(
            screen.queryByRole('button', {
                name: 'CS1010S Programming Methodology',
            }),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole('button', {
                name: 'CS2100 Computer Organisation',
            }),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole('button', {
                name: 'MA1521 Calculus for Computing',
            }),
        ).not.toBeInTheDocument();
    });

    it('filters courses case-insensitively', async () => {
        const user = userEvent.setup();

        render(
            <AddNUSCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                nusCourses={mockCourses}
                onCourseClick={vi.fn()}
            />,
        );

        const searchInput = screen.getByPlaceholderText(
            'Search by course code (e.g. CS1010)',
        );

        await user.type(searchInput, 'cs2100');

        expect(
            screen.getByRole('button', {
                name: 'CS2100 Computer Organisation',
            }),
        ).toBeInTheDocument();

        expect(
            screen.queryByRole('button', {
                name: 'CS1010S Programming Methodology',
            }),
        ).not.toBeInTheDocument();
    });

    it('calls onCourseClick with the selected course', async () => {
        const user = userEvent.setup();
        const handleCourseClick = vi.fn();

        render(
            <AddNUSCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                nusCourses={mockCourses}
                onCourseClick={handleCourseClick}
            />,
        );

        await user.click(
            screen.getByRole('button', {
                name: 'CS2040S Data Structures and Algorithms',
            }),
        );

        expect(handleCourseClick).toHaveBeenCalledOnce();

        expect(handleCourseClick).toHaveBeenCalledWith(mockCourses[1]);
    });

    it('calls onOpenChange with false when the close button is clicked', async () => {
        const user = userEvent.setup();
        const handleOpenChange = vi.fn();

        render(
            <AddNUSCourseDialog
                open={true}
                onOpenChange={handleOpenChange}
                nusCourses={mockCourses}
                onCourseClick={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole('button', {
                name: /close/i,
            }),
        );

        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
});
