'use client';

import Timer from '@/components/pomodoro/timer';
import PickTimerDialog from '@/components/pomodoro/pick-timer-dialog';
import { TimerConfig } from '@/types/timer';
import { useState } from 'react';

const defaultTimer: TimerConfig = {
    id: crypto.randomUUID(),
    name: 'Pomodoro',
    focusTime: 25,
    breakTime: 5,
};

const Pomodoro = () => {
    const [timers, setTimers] = useState<TimerConfig[]>([defaultTimer]);

    const [selectedTimer, setSelectedTimer] =
        useState<TimerConfig>(defaultTimer);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6 items-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Pomodoro Timer
            </h1>

            <PickTimerDialog
                timers={timers}
                selectedTimer={selectedTimer}
                onSelectTimer={setSelectedTimer}
            />

            <Timer key={selectedTimer.id} selectedTimer={selectedTimer} />
        </div>
    );
};

export default Pomodoro;
