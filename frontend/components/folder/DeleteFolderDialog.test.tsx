import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import DeleteFolderDialog from './DeleteFolderDialog';

const mockFolder = {
    name: 'Test Folder',
};

describe('Delete Folder Dialog', () => {
    it('does not display the dialog when open is false', () => {
        render(
            <DeleteFolderDialog
                open={false}
                onOpenChange={vi.fn()}
                folder={mockFolder}
                onDelete={vi.fn()}
            />,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        expect(
            screen.queryByRole('heading', {
                name: 'Delete Folder',
            }),
        ).not.toBeInTheDocument();
    });

    it('displays the dialog and correct text when open is true', () => {
        render(
            <DeleteFolderDialog
                open={true}
                onOpenChange={vi.fn()}
                folder={mockFolder}
                onDelete={vi.fn()}
            />,
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Delete Folder',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                `Are you sure you want to delete ${mockFolder.name}? This action cannot be undone.`,
            ),
        ).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', async () => {
        const onDeleteMock = vi.fn();
        const user = userEvent.setup();

        render(
            <DeleteFolderDialog
                open={true}
                onOpenChange={vi.fn()}
                folder={mockFolder}
                onDelete={onDeleteMock}
            />,
        );

        const deleteButton = screen.getByRole('button', {
            name: 'Delete',
        });

        await user.click(deleteButton);

        expect(onDeleteMock).toHaveBeenCalledOnce();
    });

    it('calls onOpenChange when dialog is closed', async () => {
        const onOpenChangeMock = vi.fn();
        const user = userEvent.setup();

        render(
            <DeleteFolderDialog
                open={true}
                onOpenChange={onOpenChangeMock}
                folder={mockFolder}
                onDelete={vi.fn()}
            />,
        );

        const closeButton = screen.getByRole('button', {
            name: 'Close',
        });

        await user.click(closeButton);

        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
});
