'use client';

import Timer from '@/components/pomodoro/Timer';
import PickTimerDialog from '@/components/pomodoro/PickTimerDialog';
import { TimerConfig, TimerInput } from '@/types/timer';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import TimerSkeleton from '@/components/pomodoro/TimerSkeleton';
import { AnimatePresence, motion } from 'framer-motion';

const Pomodoro = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const [timers, setTimers] = useState<TimerConfig[]>([]);
    const [selectedTimer, setSelectedTimer] = useState<TimerConfig>();
    const [incompleteTasks, setIncompleteTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>();

    const [timerLoading, setTimerLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetchTimers = async () => {
            setTimerLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pomodoro?userId=${userId}`,
            );
            const data = await response.json();
            setTimers(data);
            if (data.length > 0) {
                setSelectedTimer(data[0]);
            }

            setTimerLoading(false);
        };
        fetchTimers();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const fetchIncompleteTasks = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/task/get-uncompleted-tasks-by-user?userId=${userId}`,
            );
            const data = await response.json();
            setIncompleteTasks(data);
        };
        fetchIncompleteTasks();
    }, [userId]);

    const isInvalidTimerInput = (input: TimerInput) => {
        return (
            input.name.trim().length === 0 ||
            input.focusSeconds < 0 ||
            input.focusSeconds > 59 ||
            input.breakSeconds < 0 ||
            input.breakSeconds > 59 ||
            input.focusMinutes * 60 + input.focusSeconds === 0 ||
            input.breakMinutes * 60 + input.breakSeconds === 0
        );
    };

    const handleAddTimer = async (input: TimerInput) => {
        if (!userId) return;
        if (isInvalidTimerInput(input)) return;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pomodoro?userId=${userId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: input.name,
                    focusTime: input.focusMinutes * 60 + input.focusSeconds,
                    breakTime: input.breakMinutes * 60 + input.breakSeconds,
                }),
            },
        );
        const newTimer = await response.json();

        setTimers((prev) => [...prev, newTimer]);
    };

    const handleEditTimer = async (id: string, input: TimerInput) => {
        if (!userId) return;
        if (isInvalidTimerInput(input)) return;

        const updatedTimer = {
            name: input.name,
            focusTime: input.focusMinutes * 60 + input.focusSeconds,
            breakTime: input.breakMinutes * 60 + input.breakSeconds,
        };

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pomodoro/${id}?userId=${userId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTimer),
            },
        );

        setTimers((prev) =>
            prev.map((timer) =>
                timer.pomodoroId === id ? { ...timer, ...updatedTimer } : timer,
            ),
        );

        // To ensure the selected timer updates after modifying
        if (selectedTimer?.pomodoroId === id) {
            setSelectedTimer({
                ...selectedTimer,
                ...updatedTimer,
            });
        }
    };

    const handleDeleteTimer = async (id: string) => {
        if (!userId) return;

        // Ensures at least one timer is left
        if (timers.length <= 1) {
            return;
        }

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pomodoro/${id}?userId=${userId}`,
            {
                method: 'DELETE',
            },
        );
        setTimers((prev) => {
            const updatedTimers = prev.filter(
                (timer) => timer.pomodoroId !== id,
            );
            // Ensures at least one timer is selected
            if (selectedTimer?.pomodoroId === id) {
                setSelectedTimer(updatedTimers[0]);
            }
            return updatedTimers;
        });
    };

    const handleSelectTimer = (timer: TimerConfig) => {
        setSelectedTimer(timer);
    };

    // This ensures the selected timer get update on UI
    // However this doesnt keep previous running timer state
    const timerKey = `${selectedTimer?.pomodoroId}-${selectedTimer?.focusTime}-${selectedTimer?.breakTime}`;

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 items-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                Pomodoro Timer
            </h1>

            <PickTimerDialog
                timers={timers}
                selectedTimer={selectedTimer}
                onSelectTimer={handleSelectTimer}
                onAddTimer={handleAddTimer}
                onEditTimer={handleEditTimer}
                onDeleteTimer={handleDeleteTimer}
                canDeleteTimer={timers.length > 1}
            />

            <AnimatePresence mode="wait">
                {timerLoading ? (
                    <motion.div
                        className="w-full max-w-md"
                        key="skeleton"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <TimerSkeleton />
                    </motion.div>
                ) : (
                    selectedTimer && (
                        <motion.div
                            className="w-full max-w-md"
                            key="timer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Timer
                                key={timerKey}
                                selectedTimer={selectedTimer}
                                incompleteTasks={incompleteTasks}
                                selectedTask={selectedTask}
                                onSelectTask={setSelectedTask}
                            />
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pomodoro;
