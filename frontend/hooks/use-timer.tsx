'use client';

import { TimerConfig } from '@/types/timer';
import { useEffect, useRef, useState } from 'react';

type TimerMode = 'focus' | 'break';

interface TimerState {
    mode: TimerMode;
    timeLeft: number;
    sessions: number;
}

interface StoredTimerState extends TimerState {
    timerKey: string;
    isActive: boolean;
    savedAt: number;
}

// The logic on restoring timer
function catchUpTimer(
    restoredTimerState: TimerState,
    elapsedSeconds: number,
    timer: TimerConfig,
): TimerState {
    let { mode, timeLeft, sessions } = restoredTimerState;
    let remaining = elapsedSeconds;

    while (remaining > 0) {
        if (remaining < timeLeft) {
            // Termination (Not enough time to finsih the turn)
            timeLeft -= remaining;
            remaining = 0;
        } else {
            // Have enough time to finish the turn and go to next turn
            remaining -= timeLeft;
            mode = mode === 'focus' ? 'break' : 'focus';
            timeLeft = mode === 'focus' ? timer.focusTime : timer.breakTime;
            sessions = mode === 'break' ? sessions + 1 : sessions;
        }
    }

    return { mode, timeLeft, sessions };
}

const useTimer = (selectedTimer: TimerConfig) => {
    const [timerState, setTimerState] = useState<TimerState>({
        mode: 'focus',
        timeLeft: selectedTimer.focusTime,
        sessions: 0,
    });
    const [isActive, setIsActive] = useState(false);
    // This ensures the storing works properly
    const [hasLoaded, setHasLoaded] = useState(false);

    const timerKeyRef = useRef(selectedTimer.pomodoroId);

    const progress =
        timerState.mode === 'focus'
            ? (timerState.timeLeft / selectedTimer.focusTime) * 100
            : (timerState.timeLeft / selectedTimer.breakTime) * 100;

    const resetTimer = () => {
        setIsActive(false);
        setTimerState((prev) => {
            return {
                ...prev,
                timeLeft:
                    prev.mode === 'focus'
                        ? selectedTimer.focusTime
                        : selectedTimer.breakTime,
            };
        });
    };

    const toggleTimer = () => setIsActive((prev) => !prev);

    // Manual change of mode
    const switchMode = () => {
        setTimerState((prev) => {
            const nextMode = prev.mode === 'focus' ? 'break' : 'focus';
            return {
                mode: nextMode,
                timeLeft:
                    nextMode === 'focus'
                        ? selectedTimer.focusTime
                        : selectedTimer.breakTime,
                sessions:
                    nextMode === 'break' ? prev.sessions + 1 : prev.sessions,
            };
        });
    };

    // Restore progress saved before refresh or navigation
    useEffect(() => {
        const storedTimerState = localStorage.getItem('pomodoro');
        if (storedTimerState) {
            const saved: StoredTimerState = JSON.parse(storedTimerState);
            if (saved.timerKey === selectedTimer.pomodoroId) {
                let restoringTimerState: TimerState = {
                    mode: saved.mode,
                    timeLeft: saved.timeLeft,
                    sessions: saved.sessions,
                };

                if (saved.isActive) {
                    const elapsedSeconds = Math.max(
                        0,
                        Math.floor((Date.now() - saved.savedAt) / 1000),
                    );
                    if (elapsedSeconds > 0) {
                        restoringTimerState = catchUpTimer(
                            restoringTimerState,
                            elapsedSeconds,
                            selectedTimer,
                        );
                    }
                }

                setTimerState(restoringTimerState);
                setIsActive(saved.isActive);
            }
        }
        setHasLoaded(true);
    }, []);

    // Reset to a fresh state when user switch timer
    useEffect(() => {
        const nextKey = selectedTimer.pomodoroId;
        if (timerKeyRef.current === nextKey) {
            return;
        }
        timerKeyRef.current = nextKey;
        setIsActive(false);
        setTimerState({
            mode: 'focus',
            timeLeft: selectedTimer.focusTime,
            sessions: 0,
        });
    }, [selectedTimer]);

    useEffect(() => {
        if (!isActive) {
            return;
        }

        const interval = setInterval(() => {
            setTimerState((prev) => {
                // Automatic changes of mode
                if (prev.timeLeft <= 1) {
                    const nextMode = prev.mode === 'focus' ? 'break' : 'focus';
                    return {
                        mode: nextMode,
                        timeLeft:
                            nextMode === 'focus'
                                ? selectedTimer.focusTime
                                : selectedTimer.breakTime,
                        sessions:
                            nextMode === 'break'
                                ? prev.sessions + 1
                                : prev.sessions,
                    };
                }

                // Normal run for each seconds
                return {
                    ...prev,
                    timeLeft: prev.timeLeft - 1,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, selectedTimer]);

    // Storing
    useEffect(() => {
        if (!hasLoaded) {
            return;
        }

        const toStore: StoredTimerState = {
            ...timerState,
            isActive,
            timerKey: selectedTimer.pomodoroId,
            savedAt: Date.now(),
        };

        localStorage.setItem('pomodoro', JSON.stringify(toStore));
    }, [timerState, isActive, selectedTimer, hasLoaded]);

    return {
        progress,
        mode: timerState.mode,
        timeLeft: timerState.timeLeft,
        sessions: timerState.sessions,
        toggleTimer,
        isActive,
        resetTimer,
        switchMode,
    };
};

export default useTimer;
