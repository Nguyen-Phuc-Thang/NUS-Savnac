"use client";

import { useEffect } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderNameInput: string;
    setFolderNameInput: (value: string) => void;
    folderDescriptionInput: string;
    setFolderDescriptionInput: (value: string) => void;
    onCreate: () => void;
}

export default function AddFolderDialog({
    open,
    onOpenChange,
    folderNameInput,
    setFolderNameInput,
    folderDescriptionInput,
    setFolderDescriptionInput,
    onCreate
}: AddFolderDialogProps) {

    useEffect(() => {
        setFolderNameInput('');
        setFolderDescriptionInput('');
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Create New Folder</DialogTitle>
                </DialogHeader>
                <div>
                    <Field className="w-full">
                        <FieldLabel className="font-sans text-md">Folder Name</FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter folder name"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={folderNameInput}
                            onChange={(e) => setFolderNameInput(e.target.value)}
                        />
                    </Field>
                    <Field className="w-full mt-4">
                        <FieldLabel className="font-sans text-md">Folder Description</FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter folder description"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={folderDescriptionInput}
                            onChange={(e) => setFolderDescriptionInput(e.target.value)}
                        />
                    </Field>
                </div>
                <DialogFooter>
                    <Button onClick={onCreate} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}