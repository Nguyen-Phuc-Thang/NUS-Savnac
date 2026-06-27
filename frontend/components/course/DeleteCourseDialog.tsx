
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

interface DeleteCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: any;
    onDeleteCourse: () => void;
}

export default function DeleteCourseDialog({ open, onOpenChange, course, onDeleteCourse }: DeleteCourseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Delete Course</DialogTitle>
                </DialogHeader>
                <div className="font-sans text-md">
                    Are you sure you want to delete {course?.courseTitle}? This action cannot be undone.
                </div>
                <DialogFooter>
                    <Button variant="destructive" className="w-full font-sans" onClick={onDeleteCourse}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}