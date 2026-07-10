import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import SetTimerDialog from './set-timer-dialog';
import TimerCard from './timer-card';
import { TimerConfig } from '@/types/timer';

interface Props {
    timers: TimerConfig[];
    selectedTimer: TimerConfig;
    onSelectTimer: (timer: TimerConfig) => void;
}

export default function PickTimerDialog({
    timers,
    selectedTimer,
    onSelectTimer,
}: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-11 px-5 rounded-xl text-sm font-medium"
                >
                    Pick Timer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Pick Your Timer</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <SetTimerDialog mode="add" />

                {timers.map((timer) => (
                    <TimerCard
                        key={timer.id}
                        timer={timer}
                        selected={selectedTimer?.id === timer.id}
                        onClick={() => onSelectTimer(timer)}
                    />
                ))}
            </DialogContent>
        </Dialog>
    );
}
