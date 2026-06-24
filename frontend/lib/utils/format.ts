


export function formatToDatabase(HH: string, MM: string) {
    return `${parseInt(HH) <= 9 ? `0${parseInt(HH)}` : parseInt(HH)}${parseInt(MM) <= 9 ? `0${parseInt(MM)}` : parseInt(MM)}`
}