import { weeks, days } from "@/lib/constants/time";
import { timeSettings } from "@/lib/system/timeSettings";
import { eventTypeColors, eventTypes } from "../constants/event";
import { getEventsByUserId } from "@/lib/api/event";

export function modifyEvent(event: any): any {
  const startTime =
    "2026-06-0" +
    (days.indexOf(event.day) + 1) +
    "T" +
    event.startTime.slice(0, 2) +
    ":" +
    event.startTime.slice(2, 4) +
    ":00";
  const endTime =
    "2026-06-0" +
    (days.indexOf(event.day) + 1) +
    "T" +
    event.endTime.slice(0, 2) +
    ":" +
    event.endTime.slice(2, 4) +
    ":00";
  return {
    title: event.title,
    start: startTime,
    end: endTime,
    backgroundColor:
      eventTypeColors[event.eventType as (typeof eventTypes)[number]],
    extendedProps: {
      eventId: event.eventId,
      eventType: event.eventType,
      course: event.course ? event.course.courseCode : null,
      week: event.week,
      day: event.day,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
    },
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
    const currentDayIndex = days.indexOf(
      timeSettings.currentDay as (typeof days)[number],
    );
    const eventStartTime = event.startTime;
    return (
      currentWeekIndex < eventWeekIndex ||
      (currentWeekIndex === eventWeekIndex &&
        currentDayIndex < eventDayIndex) ||
      (currentWeekIndex === eventWeekIndex &&
        currentDayIndex === eventDayIndex &&
        timeSettings.currentTime.localeCompare(eventStartTime) < 0)
    );
  });
}

export function mapEventToAgentEvent(event: any) {
  return {
    event_id: event.eventId,
    event_type: event.eventType,
    title: event.title,
    week: event.week,
    day: event.day,
    start_time:
      "2026-06-0" +
      (days.indexOf(event.day) + 1) +
      "T" +
      event.startTime.slice(0, 2) +
      ":" +
      event.startTime.slice(2, 4) +
      ":00",
    end_time:
      "2026-06-0" +
      (days.indexOf(event.day) + 1) +
      "T" +
      event.endTime.slice(0, 2) +
      ":" +
      event.endTime.slice(2, 4) +
      ":00",
    venue: event.venue,
    course_id: event.courseId ? event.courseId : null,
  };
}

export function findDay(
  week: (typeof weeks)[number],
  day: (typeof days)[number],
  dayBefore: number,
) {
  let weekIndex = weeks.indexOf(week);
  let dayIndex = days.indexOf(day);
  while (dayBefore > 0) {
    if (dayIndex == 0) {
      if (weekIndex > 0) {
        weekIndex--;
        dayIndex = days.length - 1;
      }
    } else {
      dayIndex--;
    }

    dayBefore--;
  }
  return {
    week: weeks[weekIndex],
    day: days[dayIndex],
  };
}

export async function getEventsWithinTimeRange(
  userId: string,
  startWeek: (typeof weeks)[number],
  startDay: (typeof days)[number],
  startTime: string,
  endWeek: (typeof weeks)[number],
  endDay: (typeof days)[number],
  endTime: string,
) {
  console.log(userId);
  const events = await getEventsByUserId(userId);
  return events.filter((event: any) => {
    const eventWeekIndex = weeks.indexOf(event.week);
    const eventDayIndex = days.indexOf(event.day);
    const startWeekIndex = weeks.indexOf(startWeek);
    const startDayIndex = days.indexOf(startDay);
    const endWeekIndex = weeks.indexOf(endWeek);
    const endDayIndex = days.indexOf(endDay);

    return (
      (eventWeekIndex > startWeekIndex ||
        (eventWeekIndex === startWeekIndex &&
          (eventDayIndex > startDayIndex ||
            (eventDayIndex === startDayIndex &&
              event.startTime.localeCompare(startTime) >= 0)))) &&
      (eventWeekIndex < endWeekIndex ||
        (eventWeekIndex === endWeekIndex &&
          (eventDayIndex < endDayIndex ||
            (eventDayIndex === endDayIndex &&
              event.endTime.localeCompare(endTime) <= 0))))
    );
  });
}
