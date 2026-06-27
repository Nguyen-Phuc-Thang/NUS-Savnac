"use client";

// React hooks
import { useState } from "react";

// Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field } from "../ui/field";
import { Input } from "../ui/input";


interface AddNUSCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nusCourses: any[];
    onCourseClick: (course: any) => void;
}

export default function AddNUSCourseDialog({ open, onOpenChange, nusCourses, onCourseClick }: AddNUSCourseDialogProps) {
    const [courseCodeQuery, setCourseCodeQuery] = useState("");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Add NUS Course</DialogTitle>
                </DialogHeader>
                <div>
                    <Field className="w-full">
                        <Input
                            type="text"
                            placeholder="Search by course code (e.g. CS1010)"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={courseCodeQuery}
                            onChange={(e) => setCourseCodeQuery(e.target.value)}
                        />
                    </Field>
                    <div className="h-[60vh] overflow-y-auto mt-4">
                        {nusCourses.filter((course) => course.moduleCode.toLowerCase().includes(courseCodeQuery.toLowerCase())).map((course) => (
                            <button key={course.moduleCode} className="p-4 w-full text-left border-b hover:bg-muted cursor-pointer" onClick={() => onCourseClick(course)}>
                                <div className="font-sans font-medium">{course.moduleCode} {course.title}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
