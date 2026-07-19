import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Bot, BotMessageSquare } from "lucide-react";

interface EventInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onEditEventClick: () => void;
  onDeleteEventClick: () => void;
  onAgentButtonClick: () => void;
}

export default function EventInfoDialog({
  open,
  onOpenChange,
  event,
  onEditEventClick,
  onDeleteEventClick,
  onAgentButtonClick,
}: EventInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[50vw] max-w-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {event?.title}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="font-sans mb-4 text-lg font-bold">
            {event?.eventType}
          </div>
          <div className="font-sans">
            Start: {event?.week}, {event?.day} {event?.startTime}
          </div>
          <div className="mt-5 font-sans">
            End: {event?.week}, {event?.day} {event?.endTime}
          </div>
          <div className="mt-5 font-sans">Venue: {event?.venue}</div>

          <Button
            onClick={onAgentButtonClick}
            className="mt-5 border-2 border-primary bg-white font-sans text-primary hover:border-secondary hover:text-secondary hover:bg-white"
          >
            <BotMessageSquare className="mr-2 h-4 w-4" />
            Plan for this {event?.eventType.toLowerCase()}
          </Button>
        </div>

        <DialogFooter>
          <Button
            className="font-sans bg-secondary hover:bg-primary"
            onClick={onEditEventClick}
          >
            Edit
          </Button>
          <Button
            className="font-sans bg-secondary hover:bg-primary"
            onClick={onDeleteEventClick}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
