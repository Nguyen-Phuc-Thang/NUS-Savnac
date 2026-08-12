import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface EditCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditCourseDialog({
    open,
    onOpenChange,
}: EditCourseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">
                        Edit Course
                    </DialogTitle>
                </DialogHeader>
                <div className="flex h-[50vh] items-center justify-center font-semibold font-sans text-2xl">
                    This feature is coming out soon!
                </div>
            </DialogContent>
        </Dialog>
    );
}
