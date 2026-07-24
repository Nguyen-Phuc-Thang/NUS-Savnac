export interface TimerConfig {
    pomodoroId: string;
    name: string;
    focusTime: number;
    breakTime: number;
}

export type TimerInput = {
    name: string;
    focusMinutes: number;
    focusSeconds: number;
    breakMinutes: number;
    breakSeconds: number;
};
