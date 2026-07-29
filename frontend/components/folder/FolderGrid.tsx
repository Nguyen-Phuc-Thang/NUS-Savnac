import { FolderClosed, FolderOpen } from 'lucide-react';

interface FolderGridProps {
    folders: any[];
    selectedFolder: any;
    setSelectedFolder: (folder: any) => void;
    mode: 'NORMAL' | 'EDIT' | 'DELETE';
    onFolderClick: (folder: any) => void;
    onEditModeFolderClick?: () => void;
    onDeleteModeFolderClick?: () => void;
}

export default function FolderGrid({
    folders,
    selectedFolder,
    setSelectedFolder,
    mode,
    onFolderClick,
    onEditModeFolderClick,
    onDeleteModeFolderClick,
}: FolderGridProps) {
    const handleFolderClick = (folder: any) => {
        setSelectedFolder(folder);
        if (mode === 'EDIT') onEditModeFolderClick?.();
        else if (mode === 'DELETE') onDeleteModeFolderClick?.();
        else onFolderClick(folder);
    };
    return (
        <div className="mt-5">
            <p className="text-sm text-muted-foreground italic">
                {mode === 'EDIT' &&
                    'You are in Edit mode. Click on a folder to edit its details.'}
                {mode === 'DELETE' &&
                    'You are in Delete mode. Click on a folder to delete it.'}
            </p>
            <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(10rem,10rem))] justify-start gap-2">
                {folders.map((folder) => (
                    <div
                        className="flex flex-col items-center"
                        key={folder.folderId}
                    >
                        <button
                            type="button"
                            aria-label={`Open folder ${folder.name}`}
                            onClick={() => handleFolderClick(folder)}
                        >
                            {folder.folderId === selectedFolder?.folderId ? (
                                <FolderOpen
                                    size={120}
                                    data-testid={`folder-open-${folder.folderId}`}
                                />
                            ) : (
                                <FolderClosed
                                    size={120}
                                    data-testid={`folder-closed-${folder.folderId}`}
                                />
                            )}
                        </button>
                        <div className="font-sans text-md text-center text-black mt-2">
                            {folder.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
