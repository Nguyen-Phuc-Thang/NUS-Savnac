import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import EditFolderDialog from './EditFolderDialog';

const mockFolder = {
    name: 'Test Folder',
    description: 'This is a test folder',
};

describe('Edit Folder Dialog', () => {
    it('does not display the dialog when open is false', () => {
        render(
            <EditFolderDialog
                open={false}
                onOpenChange={vi.fn()}
                folder={mockFolder}
                folderNameInput={mockFolder.name}
                setFolderNameInput={vi.fn()}
                folderDescriptionInput={mockFolder.description}
                setFolderDescriptionInput={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        expect(
            screen.queryByRole('heading', {
                name: 'Edit Folder',
            }),
        ).not.toBeInTheDocument();
    });

    it('displays the dialog and correct text when open is true', () => {
        render(
            <EditFolderDialog
                open={true}
                onOpenChange={vi.fn()}
                folder={mockFolder}
                folderNameInput={mockFolder.name}
                setFolderNameInput={vi.fn()}
                folderDescriptionInput={mockFolder.description}
                setFolderDescriptionInput={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Edit Folder',
            }),
        ).toBeInTheDocument();
    });

    it('calls onUpdate when save button is clicked', async () => {
        const onUpdate = vi.fn();
        const user = userEvent.setup();
        render(
            <EditFolderDialog
                open={true}
                onOpenChange={vi.fn()}
                folder={mockFolder}
                folderNameInput={mockFolder.name}
                setFolderNameInput={vi.fn()}
                folderDescriptionInput={mockFolder.description}
                setFolderDescriptionInput={vi.fn()}
                onUpdate={onUpdate}
            />,
        );

        const saveButton = screen.getByRole('button', { name: 'Update' });
        await user.click(saveButton);

        expect(onUpdate).toHaveBeenCalled();
    });
    it('calls onOpenChange when cancel button is clicked', async () => {
        const onOpenChange = vi.fn();
        const user = userEvent.setup();
        render(
            <EditFolderDialog
                open={true}
                onOpenChange={onOpenChange}
                folder={mockFolder}
                folderNameInput={mockFolder.name}
                setFolderNameInput={vi.fn()}
                folderDescriptionInput={mockFolder.description}
                setFolderDescriptionInput={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        const cancelButton = screen.getByRole('button', { name: 'Close' });
        await user.click(cancelButton);

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
