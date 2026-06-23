
import { days } from "@/lib/constants/time";
import { eventTypeColors, eventTypes } from "../constants/event";



export function modifyEvent(event: any): any {
    const startTime = "2026-06-0" + (days.indexOf(event.day) + 1) + "T" + event.startTime.slice(0, 2) + ":" + event.startTime.slice(2, 4) + ":00";
    const endTime = "2026-06-0" + (days.indexOf(event.day) + 1) + "T" + event.endTime.slice(0, 2) + ":" + event.endTime.slice(2, 4) + ":00";
    return {
        title: event.title,
        start: startTime,
        end: endTime,
        backgroundColor: eventTypeColors[event.eventType as typeof eventTypes[number]],
        extendedProps: {
            eventId: event.eventId,
            eventType: event.eventType,
            course: event.course ? event.course.courseCode : null,
            week: event.week,
            day: event.day,
            startTime: event.startTime,
            endTime: event.endTime,
            venue: event.venue,
        }
    };
}