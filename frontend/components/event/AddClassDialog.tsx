"use client";

// React Hooks
import { useState } from "react";

// UI Components
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AddClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timetable: any[];
    onCreate: (classData: any) => void;
}

export default function AddClassDialog({ open, onOpenChange, timetable, onCreate }: AddClassDialogProps) {
    const [classSearchQuery, setClassSearchQuery] = useState("");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Add NUS Class</DialogTitle>
                </DialogHeader>
                <div>
                    <Field className="w-full">
                        <Input
                            type="text"
                            placeholder="Search by class code (e.g. LEC1)"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={classSearchQuery}
                            onChange={(e) => setClassSearchQuery(e.target.value)}
                        />
                    </Field>
                    <div className="h-[60vh] overflow-y-auto mt-4">
                        {timetable.filter((classData: any) => classData.classNo.toLowerCase().includes(classSearchQuery.toLowerCase())).map((classData: any) => (
                            <button key={classData.classNo} className="p-4 w-full text-left border-b hover:bg-muted cursor-pointer" onClick={(classData) => { onCreate(classData) }}>
                                <div className="font-sans font-medium flex flex-row justify-evenly">
                                    <p>{classData.classNo}</p>
                                    <p>{classData.startTime} - {classData.endTime}</p>
                                    <p>{classData.venue} </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}