"use client";

import { useEffect } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    link: any;
    linkTitleInput: string;
    setLinkTitleInput: (value: string) => void;
    linkUrlInput: string;
    setLinkUrlInput: (value: string) => void;
    onUpdate: () => void;
}


export default function EditLinkDialog({
    open,
    onOpenChange,
    link,
    linkTitleInput,
    setLinkTitleInput,
    linkUrlInput,
    setLinkUrlInput,
    onUpdate
}: EditLinkDialogProps) {

    useEffect(() => {
        setLinkTitleInput(link?.title);
        setLinkUrlInput(link?.url);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Edit Link</DialogTitle>
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
                    <Button onClick={onUpdate} className='font-sans px-6 py-5 bg-secondary' type="submit">Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )

}