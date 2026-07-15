import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Trash2 } from 'lucide-react';
import SetTimerDialog from './SetTimerDialog';
import { TimerConfig, TimerInput } from '@/types/timer';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds === 0) {
        return `${minutes} min`;
    }
    return `${minutes} min ${seconds} sec`;
};

interface Props {
    timer: TimerConfig;
    selected: boolean;
    onClick: () => void;
    onEditTimer: (id: string, timerInput: TimerInput) => void;
    onDeleteTimer: (id: string) => void;
    canDeleteTimer: boolean;
}

const TimerCard = ({
    timer,
    selected,
    onClick,
    onEditTimer,
    onDeleteTimer,
    canDeleteTimer,
}: Props) => {
    return (
        <Card
            className={`cursor-pointer transition hover:shadow-md ${
                selected && 'border-primary border-2'
            }`}
            onClick={onClick}
        >
            <CardContent className="py-0.5">
                {/**Top Row */}
                <div className="flex justify-between">
                    {/**Top Left */}
                    <div className="flex items-center gap-0.5">
                        {selected && <Check />}
                        <h1 className="font-bold text-xl">{timer.name}</h1>
                    </div>

                    {/**Top Right */}
                    <div className="flex items-center gap-0.5">
                        <SetTimerDialog
                            mode="edit"
                            timer={timer}
                            onTimerSubmit={(input) =>
                                onEditTimer(timer.pomodoroId, input)
                            }
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={!canDeleteTimer}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Timer?
                                    </AlertDialogTitle>

                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this timer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={() =>
                                            onDeleteTimer(timer.pomodoroId)
                                        }
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/**Bottom Row */}
                <div className="flex gap-4">
                    <span>Focus: {formatTime(timer.focusTime)}</span>
                    <span>Break: {formatTime(timer.breakTime)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default TimerCard;
