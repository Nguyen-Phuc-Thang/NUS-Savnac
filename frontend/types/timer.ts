export interface TimerConfig {
    id: string;
    name: string;
    focusTime: number;
    breakTime: number;
}

export type TimerInput = {
    name: string;
    focusTime: number;
    breakTime: number;
};
