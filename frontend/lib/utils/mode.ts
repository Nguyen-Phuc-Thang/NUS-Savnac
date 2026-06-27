


export function switchMode(currentMode: "NORMAL" | "EDIT" | "DELETE", newMode: "NORMAL" | "EDIT" | "DELETE") {
    if (currentMode === newMode) return "NORMAL";
    return newMode;
}

export function modeStyle(mode: "NORMAL" | "EDIT" | "DELETE", matchMode: "EDIT" | "DELETE") {
    return mode === matchMode
        ? "bg-primary text-white hover:bg-primary hover:text-white"
        : "bg-white text-black hover:bg-white hover:text-black";
}