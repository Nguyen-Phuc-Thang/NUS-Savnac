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
import { motion } from 'framer-motion';

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds === 0) {
        return `${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
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
        <motion.div
            className="w-full min-w-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={`w-full min-w-0 cursor-pointer transition hover:shadow-md ${
                    selected && 'border-primary border-2'
                }`}
                onClick={onClick}
            >
                <CardContent>
                    {/**Top Row */}
                    <div className="flex w-full items-center justify-between">
                        {/**Top Left */}
                        <div className="flex flex-1 min-w-0 items-center gap-1">
                            {selected && <Check className="shrink-0" />}
                            <h1 className="truncate font-bold text-xl">
                                {timer.name}
                            </h1>
                        </div>

                        {/**Top Right */}
                        <div className="flex items-center gap-0.5 shrink-0">
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
                                        className="h-8 w-8"
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
                                            This action cannot be undone. This
                                            will permanently delete this timer.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>

                                        <AlertDialogAction
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteTimer(timer.pomodoroId);
                                            }}
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
                        <span className="text-base">
                            Focus: {formatTime(timer.focusTime)}
                        </span>
                        <span className="text-base">
                            Break: {formatTime(timer.breakTime)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TimerCard;
