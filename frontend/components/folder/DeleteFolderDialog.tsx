import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';

interface DeleteFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folder: any;
    onDelete: () => void;
}

export default function DeleteFolderDialog({
    open,
    onOpenChange,
    folder,
    onDelete,
}: DeleteFolderDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">
                        Delete Folder
                    </DialogTitle>
                </DialogHeader>
                <div className="font-sans text-md">
                    Are you sure you want to delete {folder?.name}? This action
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
