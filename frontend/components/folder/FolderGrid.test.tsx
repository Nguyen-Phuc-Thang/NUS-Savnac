import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import FolderGrid from './FolderGrid';

const mockFolders = [
    {
        folderId: 'folder-1',
        name: 'Lecture Notes',
    },
    {
        folderId: 'folder-2',
        name: 'Tutorials',
    },
    {
        folderId: 'folder-3',
        name: 'Past Papers',
    },
];

function renderFolderGrid({
    mode = 'NORMAL',
    selectedFolder = null,
}: {
    mode?: 'NORMAL' | 'EDIT' | 'DELETE';
    selectedFolder?: (typeof mockFolders)[number] | null;
} = {}) {
    const callbacks = {
        setSelectedFolder: vi.fn(),
        onFolderClick: vi.fn(),
        onEditModeFolderClick: vi.fn(),
        onDeleteModeFolderClick: vi.fn(),
    };

    render(
        <FolderGrid
            folders={mockFolders}
            selectedFolder={selectedFolder}
            mode={mode}
            {...callbacks}
        />,
    );

    return callbacks;
}

describe('FolderGrid', () => {
    it('renders all folder names', () => {
        renderFolderGrid();

        mockFolders.forEach((folder) => {
            expect(screen.getByText(folder.name)).toBeInTheDocument();
        });
    });

    it('renders the correct number of folder buttons', () => {
        renderFolderGrid();

        const folderButtons = screen.getAllByRole('button');

        expect(folderButtons).toHaveLength(mockFolders.length);
    });

    it('shows the selected folder as open', () => {
        renderFolderGrid({
            selectedFolder: mockFolders[0],
        });

        expect(screen.getByTestId('folder-open-folder-1')).toBeInTheDocument();

        expect(
            screen.getByTestId('folder-closed-folder-2'),
        ).toBeInTheDocument();

        expect(
            screen.getByTestId('folder-closed-folder-3'),
        ).toBeInTheDocument();
    });

    it('shows all folders as closed when none is selected', () => {
        renderFolderGrid();

        mockFolders.forEach((folder) => {
            expect(
                screen.getByTestId(`folder-closed-${folder.folderId}`),
            ).toBeInTheDocument();
        });
    });

    it('selects the folder and calls onFolderClick in NORMAL mode', async () => {
        const user = userEvent.setup();

        const {
            setSelectedFolder,
            onFolderClick,
            onEditModeFolderClick,
            onDeleteModeFolderClick,
        } = renderFolderGrid({
            mode: 'NORMAL',
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Open folder Lecture Notes',
            }),
        );

        expect(setSelectedFolder).toHaveBeenCalledOnce();
        expect(setSelectedFolder).toHaveBeenCalledWith(mockFolders[0]);

        expect(onFolderClick).toHaveBeenCalledOnce();
        expect(onFolderClick).toHaveBeenCalledWith(mockFolders[0]);

        expect(onEditModeFolderClick).not.toHaveBeenCalled();
        expect(onDeleteModeFolderClick).not.toHaveBeenCalled();
    });

    it('selects the folder and calls the edit callback in EDIT mode', async () => {
        const user = userEvent.setup();

        const {
            setSelectedFolder,
            onFolderClick,
            onEditModeFolderClick,
            onDeleteModeFolderClick,
        } = renderFolderGrid({
            mode: 'EDIT',
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Open folder Tutorials',
            }),
        );

        expect(setSelectedFolder).toHaveBeenCalledOnce();
        expect(setSelectedFolder).toHaveBeenCalledWith(mockFolders[1]);

        expect(onEditModeFolderClick).toHaveBeenCalledOnce();

        expect(onFolderClick).not.toHaveBeenCalled();
        expect(onDeleteModeFolderClick).not.toHaveBeenCalled();
    });

    it('selects the folder and calls the delete callback in DELETE mode', async () => {
        const user = userEvent.setup();

        const {
            setSelectedFolder,
            onFolderClick,
            onEditModeFolderClick,
            onDeleteModeFolderClick,
        } = renderFolderGrid({
            mode: 'DELETE',
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Open folder Past Papers',
            }),
        );

        expect(setSelectedFolder).toHaveBeenCalledOnce();
        expect(setSelectedFolder).toHaveBeenCalledWith(mockFolders[2]);

        expect(onDeleteModeFolderClick).toHaveBeenCalledOnce();

        expect(onFolderClick).not.toHaveBeenCalled();
        expect(onEditModeFolderClick).not.toHaveBeenCalled();
    });

    it('displays the edit mode instruction', () => {
        renderFolderGrid({
            mode: 'EDIT',
        });

        expect(
            screen.getByText(
                'You are in Edit mode. Click on a folder to edit its details.',
            ),
        ).toBeInTheDocument();
    });

    it('displays the delete mode instruction', () => {
        renderFolderGrid({
            mode: 'DELETE',
        });

        expect(
            screen.getByText(
                'You are in Delete mode. Click on a folder to delete it.',
            ),
        ).toBeInTheDocument();
    });

    it('does not display a mode instruction in NORMAL mode', () => {
        renderFolderGrid({
            mode: 'NORMAL',
        });

        expect(
            screen.queryByText(/You are in Edit mode/i),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(/You are in Delete mode/i),
        ).not.toBeInTheDocument();
    });

    it('renders no folder buttons when the folder list is empty', () => {
        render(
            <FolderGrid
                folders={[]}
                selectedFolder={null}
                mode="NORMAL"
                setSelectedFolder={vi.fn()}
                onFolderClick={vi.fn()}
                onEditModeFolderClick={vi.fn()}
                onDeleteModeFolderClick={vi.fn()}
            />,
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
