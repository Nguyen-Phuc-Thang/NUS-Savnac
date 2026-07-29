import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AddFolderDialog from './AddFolderDialog';

describe('Add Folder Dialog', () => {
    it('does not display the dialog when open is false', () => {
        render(
            <AddFolderDialog
                open={false}
                onOpenChange={vi.fn()}
                folderNameInput=""
                setFolderNameInput={vi.fn()}
                folderDescriptionInput=""
                setFolderDescriptionInput={vi.fn()}
                onCreate={vi.fn()}
            />,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        expect(
            screen.queryByRole('heading', {
                name: 'Create New Folder',
            }),
        ).not.toBeInTheDocument();
    });

    it('displays the dialog and folder inputs are empty when open is true', () => {
        render(
            <AddFolderDialog
                open={true}
                onOpenChange={vi.fn()}
                folderNameInput=""
                setFolderNameInput={vi.fn()}
                folderDescriptionInput=""
                setFolderDescriptionInput={vi.fn()}
                onCreate={vi.fn()}
            />,
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Create New Folder',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText('Enter folder description'),
        ).toHaveValue('');

        expect(screen.getByPlaceholderText('Enter folder name')).toHaveValue(
            '',
        );
    });

    it('calls onCreate when create button is clicked', async () => {
        const mockOnCreate = vi.fn();
        const user = userEvent.setup();

        render(
            <AddFolderDialog
                open={true}
                onOpenChange={vi.fn()}
                folderNameInput=""
                setFolderNameInput={vi.fn()}
                folderDescriptionInput=""
                setFolderDescriptionInput={vi.fn()}
                onCreate={mockOnCreate}
            />,
        );

        const createButton = screen.getByRole('button', {
            name: 'Create',
        });

        await user.click(createButton);

        expect(mockOnCreate).toHaveBeenCalledOnce();
    });

    it('calls onOpenChange with false when the dialog is closed', async () => {
        const mockOnOpenChange = vi.fn();
        const user = userEvent.setup();

        render(
            <AddFolderDialog
                open={true}
                onOpenChange={mockOnOpenChange}
                folderNameInput=""
                setFolderNameInput={vi.fn()}
                folderDescriptionInput=""
                setFolderDescriptionInput={vi.fn()}
                onCreate={vi.fn()}
            />,
        );

        const closeButton = screen.getByRole('button', {
            name: 'Close',
        });

        await user.click(closeButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
});
