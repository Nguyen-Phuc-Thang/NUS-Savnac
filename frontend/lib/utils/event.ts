
import { weeks, days } from "@/lib/constants/time";
import { timeSettings } from "@/lib/system/timeSettings";
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


export function sortEvents(events: any[]) {
    const sortedEvents = events.sort((a, b) => {
        const weekA = weeks.indexOf(a.week);
        const weekB = weeks.indexOf(b.week);
        if (weekA !== weekB) {
            return weekA - weekB;
        }
        const dayA = days.indexOf(a.day);
        const dayB = days.indexOf(b.day);
        if (dayA !== dayB) {
            return dayA - dayB;
        }
        return a.startTime.localeCompare(b.startTime);
    });
    return sortedEvents;
}

export function filterUpcomingEvents(events: any[]) {
    return events.filter((event: any) => {
        const eventWeekIndex = weeks.indexOf(event.week);
        const eventDayIndex = days.indexOf(event.day);
        const currentWeekIndex = weeks.indexOf(timeSettings.currentWeek);
        const currentDayIndex = days.indexOf(timeSettings.currentDay as (typeof days)[number]);
        const eventStartTime = event.startTime;
        return (currentWeekIndex < eventWeekIndex)
            || (currentWeekIndex === eventWeekIndex && currentDayIndex < eventDayIndex)
            || (currentWeekIndex === eventWeekIndex && currentDayIndex === eventDayIndex && timeSettings.currentTime.localeCompare(eventStartTime) < 0);
    });
}