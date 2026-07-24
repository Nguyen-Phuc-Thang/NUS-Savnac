'use client';
import { Button } from '@/components/ui/button';
import useTimer from '@/hooks/use-timer';
import { TimerConfig } from '@/types/timer';
import PickTaskDialog from './PickTaskDialog';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

interface Props {
    selectedTimer: TimerConfig;
    incompleteTasks: any[];
    selectedTask: any | undefined;
    onSelectTask: (task: any | undefined) => void;
}

const Timer = ({
    selectedTimer,
    incompleteTasks,
    selectedTask,
    onSelectTask,
}: Props) => {
    const {
        progress,
        mode,
        timeLeft,
        sessions,
        toggleTimer,
        isActive,
        resetTimer,
        switchMode,
    } = useTimer(selectedTimer);

    // Format time as MM:SS
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="max-w-md bg-white shadow-xl w-full p-8 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <motion.h2
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-medium"
                >
                    {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                </motion.h2>

                <div className="text-md text-gray-500">
                    Sessions: {sessions}
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <PickTaskDialog
                    incompleteTasks={incompleteTasks}
                    selectedTask={selectedTask}
                    onSelectTask={onSelectTask}
                />
            </div>

            <motion.div
                animate={{
                    scale: isActive ? 1.025 : 1,
                }}
                className="w-72 h-72 mx-auto mb-8"
            >
                <CircularProgressbar
                    value={progress}
                    text={formattedTime}
                    styles={buildStyles({
                        pathColor: mode === 'focus' ? '#ef4444' : '#22c55e',
                        trailColor: '#e5e7eb',
                        textColor: '#111827',
                    })}
                />
            </motion.div>

            <div className="flex justify-center space-x-4 mt-4 mb-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={toggleTimer}
                        className="w-32 h-12 text-lg"
                        size="lg"
                        variant="secondary"
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={resetTimer}
                        className="w-32 h-12 text-lg"
                        size="lg"
                        variant="destructive"
                    >
                        Reset
                    </Button>
                </motion.div>
            </div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center space-x-4 mb-4 py-2"
            >
                <Button
                    onClick={switchMode}
                    className="w-full text-lg"
                    size="lg"
                    variant="outline"
                >
                    Switch to {mode === 'focus' ? 'Break' : 'Focus'}
                </Button>
            </motion.div>
        </div>
    );
};

export default Timer;
