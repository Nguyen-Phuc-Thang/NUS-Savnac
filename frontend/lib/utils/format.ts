import { months } from "@/lib/constants/time";


export function formatToDatabase(HH: string, MM: string) {
    return `${parseInt(HH) <= 9 ? `0${parseInt(HH)}` : parseInt(HH)}${parseInt(MM) <= 9 ? `0${parseInt(MM)}` : parseInt(MM)}`
}

export function formatToMonthDayYear(date: string) {
    // date is in the format of 2026-04-29T01:00:00.000Z
    const dateObj = new Date(date)
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    const year = dateObj.getFullYear()
    return `${months[month - 1]} ${day}, ${year}`
}