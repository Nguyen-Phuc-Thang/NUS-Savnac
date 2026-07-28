import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import FolderPanel from './FolderPanel';

const mockFolder = {
    folderId: 'folder-1',
    name: 'Lecture Resources',
    description: 'Useful lecture notes and recordings',
    links: [
        {
            linkId: 'link-1',
            title: 'Canvas',
            url: 'https://canvas.nus.edu.sg',
        },
        {
            linkId: 'link-2',
            title: 'NUSMods',
            url: 'https://nusmods.com',
        },
    ],
};

function renderFolderPanel({
    open = true,
    folder = mockFolder,
}: {
    open?: boolean;
    folder?: typeof mockFolder | null;
} = {}) {
    const callbacks = {
        onLinkClick: vi.fn(),
        onAdd: vi.fn(),
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    const result = render(
        <FolderPanel open={open} folder={folder} {...callbacks} />,
    );

    return {
        ...callbacks,
        ...result,
    };
}

describe('Folder Panel', () => {
    it('uses the open width when open is true', () => {
        renderFolderPanel({
            open: true,
        });

        expect(
            screen.getByRole('complementary', {
                name: 'Folder panel',
            }),
        ).toHaveClass('w-[20rem]');
    });

    it('uses zero width when open is false', () => {
        renderFolderPanel({
            open: false,
        });

        expect(
            screen.getByRole('complementary', {
                name: 'Folder panel',
            }),
        ).toHaveClass('w-0');
    });

    it('displays the folder name and description', () => {
        renderFolderPanel();

        expect(
            screen.getByRole('heading', {
                name: 'Lecture Resources',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText('Useful lecture notes and recordings'),
        ).toBeInTheDocument();
    });

    it('renders all links in the folder', () => {
        renderFolderPanel();

        const canvasLink = screen.getByRole('link', {
            name: 'Canvas',
        });

        const nusModsLink = screen.getByRole('link', {
            name: 'NUSMods',
        });

        expect(canvasLink).toBeInTheDocument();
        expect(nusModsLink).toBeInTheDocument();

        expect(canvasLink).toHaveAttribute('href', 'https://canvas.nus.edu.sg');

        expect(nusModsLink).toHaveAttribute('href', 'https://nusmods.com');
    });

    it('opens links in a new tab safely', () => {
        renderFolderPanel();

        const canvasLink = screen.getByRole('link', {
            name: 'Canvas',
        });

        expect(canvasLink).toHaveAttribute('target', '_blank');
        expect(canvasLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('calls onAdd when the add button is clicked', async () => {
        const user = userEvent.setup();
        const { onAdd } = renderFolderPanel();

        await user.click(
            screen.getByRole('button', {
                name: 'Add link',
            }),
        );

        expect(onAdd).toHaveBeenCalledOnce();
    });

    it('selects the link and calls onEdit when edit is clicked', async () => {
        const user = userEvent.setup();

        const { onLinkClick, onEdit, onDelete } = renderFolderPanel();

        await user.click(
            screen.getByRole('button', {
                name: 'Edit Canvas',
            }),
        );

        expect(onLinkClick).toHaveBeenCalledOnce();
        expect(onLinkClick).toHaveBeenCalledWith(mockFolder.links[0]);

        expect(onEdit).toHaveBeenCalledOnce();
        expect(onDelete).not.toHaveBeenCalled();
    });

    it('selects the link and calls onDelete when delete is clicked', async () => {
        const user = userEvent.setup();

        const { onLinkClick, onEdit, onDelete } = renderFolderPanel();

        await user.click(
            screen.getByRole('button', {
                name: 'Delete Canvas',
            }),
        );

        expect(onLinkClick).toHaveBeenCalledOnce();
        expect(onDelete).toHaveBeenCalledOnce();
        expect(onEdit).not.toHaveBeenCalled();
    });

    it('does not render folder content when folder is null', () => {
        renderFolderPanel({
            folder: null,
        });

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();

        expect(screen.queryByText('Links')).not.toBeInTheDocument();

        expect(
            screen.queryByRole('button', {
                name: 'Add link',
            }),
        ).not.toBeInTheDocument();
    });

    it('renders no links when the folder has no links', () => {
        renderFolderPanel({
            folder: {
                ...mockFolder,
                links: [],
            },
        });

        expect(screen.queryByRole('link')).not.toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Add link',
            }),
        ).toBeInTheDocument();
    });
});
