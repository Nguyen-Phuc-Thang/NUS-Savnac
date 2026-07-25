import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';

interface DeleteEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: () => void;
}

export default function DeleteEventDialog({
    open,
    onOpenChange,
    onDelete,
}: DeleteEventDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">
                        Delete Event
                    </DialogTitle>
                </DialogHeader>
                <div className="font-sans text-md">
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                </div>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        className="w-full font-sans"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
