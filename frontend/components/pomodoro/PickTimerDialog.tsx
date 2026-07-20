import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import SetTimerDialog from './SetTimerDialog';
import TimerCard from './TimerCard';
import { TimerConfig, TimerInput } from '@/types/timer';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    timers: TimerConfig[];
    selectedTimer: TimerConfig | undefined;
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
            <motion.div whileHover={{ scale: 1.05 }}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-11 px-5 rounded-xl text-lg"
                    >
                        Pick Timer
                    </Button>
                </DialogTrigger>
            </motion.div>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Pick Your Timer
                    </DialogTitle>
                </DialogHeader>

                <SetTimerDialog mode="add" onTimerSubmit={onAddTimer} />

                <AnimatePresence>
                    {timers.map((timer) => (
                        <TimerCard
                            key={timer.pomodoroId}
                            timer={timer}
                            selected={
                                selectedTimer?.pomodoroId === timer.pomodoroId
                            }
                            onClick={() => onSelectTimer(timer)}
                            onEditTimer={onEditTimer}
                            onDeleteTimer={onDeleteTimer}
                            canDeleteTimer={canDeleteTimer}
                        />
                    ))}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
