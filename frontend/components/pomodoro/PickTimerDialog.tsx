import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import SetTimerDialog from './SetTimerDialog';
import TimerCard from './TimerCard';
import { TimerConfig, TimerInput } from '@/types/timer';

interface Props {
    timers: TimerConfig[];
    selectedTimer: TimerConfig;
    onSelectTimer: (timer: TimerConfig) => void;
    onAddTimer: (timerInput: TimerInput) => void;
    onEditTimer: (id: string, timerInput: TimerInput) => void;
    onDeleteTimer: (id: string) => void;
    canDeleteTimer: boolean;
}

export default function PickTimerDialog({
    timers,
    selectedTimer,
    onSelectTimer,
    onAddTimer,
    onEditTimer,
    onDeleteTimer,
    canDeleteTimer,
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

                <SetTimerDialog mode="add" onTimerSubmit={onAddTimer} />

                {timers.map((timer) => (
                    <TimerCard
                        key={timer.id}
                        timer={timer}
                        selected={selectedTimer?.id === timer.id}
                        onClick={() => onSelectTimer(timer)}
                        onEditTimer={onEditTimer}
                        onDeleteTimer={onDeleteTimer}
                        canDeleteTimer={canDeleteTimer}
                    />
                ))}
            </DialogContent>
        </Dialog>
    );
}
