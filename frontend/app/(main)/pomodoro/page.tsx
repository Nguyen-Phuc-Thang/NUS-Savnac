'use client';

import Timer from '@/components/pomodoro/Timer';
import PickTimerDialog from '@/components/pomodoro/PickTimerDialog';
import { TimerConfig, TimerInput } from '@/types/timer';
import { useState } from 'react';

const defaultTimer: TimerConfig = {
    id: crypto.randomUUID(),
    name: 'Default',
    focusTime: 25 * 60,
    breakTime: 5 * 60,
};

const Pomodoro = () => {
    const [timers, setTimers] = useState<TimerConfig[]>([defaultTimer]);

    const [selectedTimer, setSelectedTimer] =
        useState<TimerConfig>(defaultTimer);

    const handleAddTimer = (input: TimerInput) => {
        const newTimer: TimerConfig = {
            id: crypto.randomUUID(),
            name: input.name,
            focusTime: input.focusMinutes * 60 + input.focusSeconds,
            breakTime: input.breakMinutes * 60 + input.breakSeconds,
        };
        setTimers((prev) => [...prev, newTimer]);
    };

    const handleEditTimer = (id: string, input: TimerInput) => {
        const updatedTimer = {
            name: input.name,
            focusTime: input.focusMinutes * 60 + input.focusSeconds,
            breakTime: input.breakMinutes * 60 + input.breakSeconds,
        };

        setTimers((prev) =>
            prev.map((timer) =>
                timer.id === id ? { ...timer, ...updatedTimer } : timer,
            ),
        );

        // To ensure the timer updates after modifying
        if (selectedTimer.id === id) {
            setSelectedTimer((prev) => ({
                ...prev,
                ...updatedTimer,
            }));
        }
    };

    const handleDeleteTimer = (id: string) => {
        // Ensures at least one timer is left
        if (timers.length <= 1) {
            return;
        }
        setTimers((prev) => {
            const updatedTimers = prev.filter((timer) => timer.id !== id);
            // Ensures at least one timer is selected
            if (selectedTimer.id === id) {
                setSelectedTimer(updatedTimers[0]);
            }
            return updatedTimers;
        });
    };

    // This ensures the selected timer get update on UI
    // However this doesnt keep previous running timer state
    const timerKey = `${selectedTimer.id}-${selectedTimer.focusTime}-${selectedTimer.breakTime}`;

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6 items-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Pomodoro Timer
            </h1>

            <PickTimerDialog
                timers={timers}
                selectedTimer={selectedTimer}
                onSelectTimer={setSelectedTimer}
                onAddTimer={handleAddTimer}
                onEditTimer={handleEditTimer}
                onDeleteTimer={handleDeleteTimer}
                canDeleteTimer={timers.length > 1}
            />

            <Timer key={timerKey} selectedTimer={selectedTimer} />
        </div>
    );
};

export default Pomodoro;
