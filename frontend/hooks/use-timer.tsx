"use client";

import { useEffect, useState } from "react";

type TimerMode = "focus" | "break";

const focusTime = 25;
const breakTime = 5;

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  sessions: number;
}

const useTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    mode: "focus",
    timeLeft: focusTime * 60,
    sessions: 0,
  });
  const [isActive, setIsActive] = useState(false);

  const resetTimer = () => {
    setIsActive(false);
    setTimerState(() => {
      return {
        mode: "focus",
        timeLeft: focusTime * 60,
        sessions: 0,
      };
    });
  };

  const toggleTimer = () => setIsActive((prev) => !prev);

  // Manual change of mode
  const switchMode = () => {
    setTimerState((prev) => {
      const nextMode = prev.mode === "focus" ? "break" : "focus";
      return {
        mode: nextMode,
        timeLeft: nextMode === "focus" ? focusTime * 60 : breakTime * 60,
        sessions: nextMode === "break" ? prev.sessions + 1 : prev.sessions,
      };
    });
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const interval = setInterval(() => {
      setTimerState((prev) => {
        // Automatic changes of mode
        if (prev.timeLeft <= 1) {
          const nextMode = prev.mode === "focus" ? "break" : "focus";
          return {
            mode: nextMode,
            timeLeft: nextMode === "focus" ? focusTime * 60 : breakTime * 60,
            sessions: nextMode === "break" ? prev.sessions + 1 : prev.sessions,
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
  }, [isActive]);

  return {
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
