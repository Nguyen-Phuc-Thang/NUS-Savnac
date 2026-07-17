'use client';
import { Button } from '@/components/ui/button';
import useTimer from '@/hooks/use-timer';
import { TimerConfig } from '@/types/timer';
import PickTaskDialog from './PickTaskDialog';

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
        <div className="max-w-sm bg-white shadow-xl w-full p-8 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium capitalize">
                    {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                </h2>
                <div className="text-sm text-gray-500">
                    Sessions: {sessions}
                </div>
            </div>

            <div className="flex justify-center mb-4">
                <PickTaskDialog
                    incompleteTasks={incompleteTasks}
                    selectedTask={selectedTask}
                    onSelectTask={onSelectTask}
                />
            </div>

            <div
                className={`text-center text-6xl font-bold mb-7 
      ${mode === 'focus' ? 'text-red-500' : 'text-green-500'}`}
            >
                {formattedTime}
            </div>

            <div className="flex justify-center space-x-4 mb-4">
                <Button onClick={toggleTimer} size="lg" variant="secondary">
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer} size="lg" variant="destructive">
                    Reset
                </Button>
            </div>

            <div className="flex justify-center space-x-4 mb-4 py-2">
                <Button
                    onClick={switchMode}
                    className="w-full"
                    size="lg"
                    variant="outline"
                >
                    Switch to {mode === 'focus' ? 'Break' : 'Focus'}
                </Button>
            </div>
        </div>
    );
};

export default Timer;
