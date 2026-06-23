
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface EventInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: any;
    onEditEventClick: () => void;
    onDeleteEventClick: () => void;
}

export default function EventInfoDialog({ open, onOpenChange, event, onEditEventClick, onDeleteEventClick }: EventInfoDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50vw] max-w-none">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">{event?.title}</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="font-sans">Start: {event?.week}, {event?.day} {event?.startTime}</div>
                    <div className="mt-5 font-sans">End: {event?.week}, {event?.day} {event?.endTime}</div>
                    <div className="mt-5 font-sans">Venue: {event?.venue}</div>
                </div>

                <DialogFooter>
                    <Button className='font-sans bg-secondary hover:bg-primary' onClick={onEditEventClick}>Edit</Button>
                    <Button className='font-sans bg-secondary hover:bg-primary' onClick={onDeleteEventClick}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}