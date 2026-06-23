export const eventTypes = ["CLASS", "DEADLINE", "EXAM", "OTHERS"] as const;
export const eventTypeColors: { [key in typeof eventTypes[number]]: string } = {
    "CLASS": "#60A5FA", // blue-360
    "DEADLINE": "#F87171", // red-300
    "EXAM": "#FBBF24", // yellow-300
    "OTHERS": "#34D399" // green-300
}