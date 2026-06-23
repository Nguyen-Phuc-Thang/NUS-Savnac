"use client";

import { useEffect } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    linkTitleInput: string;
    setLinkTitleInput: (value: string) => void;
    linkUrlInput: string;
    setLinkUrlInput: (value: string) => void;
    onCreate: () => void;
}


export default function AddLinkDialog({
    open,
    onOpenChange,
    linkTitleInput,
    setLinkTitleInput,
    linkUrlInput,
    setLinkUrlInput,
    onCreate
}: AddLinkDialogProps) {

    useEffect(() => {
        setLinkTitleInput("");
        setLinkUrlInput("");
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Create New Link</DialogTitle>
                </DialogHeader>
                <div>
                    <Field className="w-full">
                        <FieldLabel className="font-sans text-md">Link Title</FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter link title"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={linkTitleInput}
                            onChange={(e) => setLinkTitleInput(e.target.value)}
                        />
                    </Field>
                    <Field className="w-full mt-4">
                        <FieldLabel className="font-sans text-md">Link URL</FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter link URL"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={linkUrlInput}
                            onChange={(e) => setLinkUrlInput(e.target.value)}
                        />
                    </Field>
                </div>
                <DialogFooter>
                    <Button onClick={onCreate} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )

}