'use client';

// React Hooks
import { useEffect } from 'react';

// UI Components
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folder: any;
    folderNameInput: string;
    setFolderNameInput: (value: string) => void;
    folderDescriptionInput: string;
    setFolderDescriptionInput: (value: string) => void;
    onUpdate: () => void;
}

export default function EditFolderDialog({
    open,
    onOpenChange,
    folder,
    folderNameInput,
    setFolderNameInput,
    folderDescriptionInput,
    setFolderDescriptionInput,
    onUpdate,
}: EditFolderDialogProps) {
    useEffect(() => {
        setFolderNameInput(folder?.name);
        setFolderDescriptionInput(folder?.description);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">
                        Edit Folder
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Field className="w-full">
                        <FieldLabel className="font-sans text-md">
                            Folder Name
                        </FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter folder name"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={folderNameInput}
                            onChange={(e) => setFolderNameInput(e.target.value)}
                        />
                    </Field>
                    <Field className="w-full mt-4">
                        <FieldLabel className="font-sans text-md">
                            Folder Description
                        </FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter folder description"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={folderDescriptionInput}
                            onChange={(e) =>
                                setFolderDescriptionInput(e.target.value)
                            }
                        />
                    </Field>
                </div>
                <DialogFooter>
                    <Button
                        onClick={onUpdate}
                        className="font-sans px-6 py-5 bg-secondary"
                        type="submit"
                    >
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
