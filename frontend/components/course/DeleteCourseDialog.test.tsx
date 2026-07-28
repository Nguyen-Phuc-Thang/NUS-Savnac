import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import DeleteCourseDialog from './DeleteCourseDialog';

const mockCourse = {
    courseCode: 'CS1010S',
    courseTitle: 'Programming Methodology',
    tasks: [],
};

describe('Delete Course Dialog', () => {
    it('does not display the dialog when open is false', () => {
        render(
            <DeleteCourseDialog
                open={false}
                onOpenChange={vi.fn()}
                course={mockCourse}
                onDeleteCourse={vi.fn()}
            />,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        expect(screen.queryByText('Delete Course')).not.toBeInTheDocument();
    });
    it('displays the dialog when open is true', () => {
        render(
            <DeleteCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                course={mockCourse}
                onDeleteCourse={vi.fn()}
            />,
        );
        expect(screen.queryByRole('dialog')).toBeInTheDocument();

        expect(screen.queryByText('Delete Course')).toBeInTheDocument();
    });
    it('contains course title in the dialog when open is true', () => {
        render(
            <DeleteCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                course={mockCourse}
                onDeleteCourse={vi.fn()}
            />,
        );
        expect(
            screen.queryByText(
                'Are you sure you want to delete Programming Methodology? This action cannot be undone.',
            ),
        ).toBeInTheDocument();
    });
    it('calls onDeleteCourse when the delete button is clicked', async () => {
        const onDeleteCourseMock = vi.fn();
        const user = userEvent.setup();
        render(
            <DeleteCourseDialog
                open={true}
                onOpenChange={vi.fn()}
                course={mockCourse}
                onDeleteCourse={onDeleteCourseMock}
            />,
        );

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        await user.click(deleteButton);

        expect(onDeleteCourseMock).toHaveBeenCalledOnce();
    });
    it('calls onOpenChange with false when the dialog is closed', async () => {
        const onOpenChangeMock = vi.fn();
        const user = userEvent.setup();
        render(
            <DeleteCourseDialog
                open={true}
                onOpenChange={onOpenChangeMock}
                course={mockCourse}
                onDeleteCourse={vi.fn()}
            />,
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);

        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
});
