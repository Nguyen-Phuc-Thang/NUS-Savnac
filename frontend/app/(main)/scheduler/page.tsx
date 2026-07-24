"use client";

// React hooks
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// UI Components
import { toast } from "sonner";
import AddEventDialog from "@/components/event/AddEventDialog";
import EditEventDialog from "@/components/event/EditEventDialog";
import EventInfoDialog from "@/components/event/EventInfoDialog";
import ScheduleCalendar from "@/components/event/ScheduleCalendar";
import DeleteEventDialog from "@/components/event/DeleteEventDialog";

// API calls
import {
  getEventsByUserId,
  addEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api/event";

// Utils
import { formatToDatabase } from "@/lib/utils/format";
import { sortEvents, filterUpcomingEvents } from "@/lib/utils/event";
import AgentChatDialog from "@/components/agent/AgentChatDialog";

function EventList({ events }: { events: any[] }) {
  return (
    <div>
      <div>
        <div className="flex flex-row w-full mt-2 font-semibold">
          <div className="w-[35%] border-b-4 py-2">Time</div>
          <div className="w-[20%] border-b-4 py-2">Course</div>
          <div className="w-[20%] border-b-4 py-2">Title</div>
          <div className="w-[25%] border-b-4 py-2">Venue</div>
        </div>
      </div>
      <div className="mt-5"></div>
      <div>
        {events.map((event: any) => (
          <div
            key={event.id}
            className="flex flex-row w-full mt-4 font-sans hover:bg-gray-100 rounded-md p-2"
          >
            <div className="w-[10%] text-center">{event.week}</div>
            <div className="w-[10%] text-center">{event.day}</div>
            <div className="w-[15%] text-center ">
              {event.startTime.slice(0, 2)}:{event.startTime.slice(2, 4)} -{" "}
              {event.endTime.slice(0, 2)}:{event.endTime.slice(2, 4)}
            </div>
            <div className="w-[20%]">
              {event.course ? event.course.courseCode : "No course related"}
            </div>
            <div className="w-[20%] font-bold">{event.title}</div>
            <div className="w-[25%]">{event.venue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchedulerPage() {
  const { data: session } = useSession();

  const [classes, setClasses] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [others, setOthers] = useState<any[]>([]);

  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [eventInfoDialogOpen, setEventInfoDialogOpen] = useState(false);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [eventTitleInput, setEventTitleInput] = useState("");
  const [eventTypeInput, setEventTypeInput] = useState<
    "CLASS" | "DEADLINE" | "EXAM" | "OTHERS"
  >("CLASS");
  const [eventWeekInput, setEventWeekInput] = useState("");
  const [eventDayInput, setEventDayInput] = useState("");
  const [eventStartTimeHourInput, setEventStartTimeHourInput] = useState("");
  const [eventStartTimeMinuteInput, setEventStartTimeMinuteInput] =
    useState("");
  const [eventEndTimeHourInput, setEventEndTimeHourInput] = useState("");
  const [eventEndTimeMinuteInput, setEventEndTimeMinuteInput] = useState("");
  const [eventVenueInput, setEventVenueInput] = useState("");
  const [agentChatDialogOpen, setAgentChatDialogOpen] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      title: info.event.title,
      eventType: info.event.extendedProps.eventType,
      course: info.event.extendedProps.course,
      venue: info.event.extendedProps.venue,
      week: info.event.extendedProps.week,
      day: info.event.extendedProps.day,
      startTime:
        info.event.extendedProps.startTime.slice(0, 2) +
        ":" +
        info.event.extendedProps.startTime.slice(2, 4),
      endTime:
        info.event.extendedProps.endTime.slice(0, 2) +
        ":" +
        info.event.extendedProps.endTime.slice(2, 4),
      eventId: info.event.extendedProps.eventId,
    });
    setEventInfoDialogOpen(true);
  };

  const getAllEvents = async () => {
    try {
      const events = await getEventsByUserId(session?.user?.id || "");
      setEvents(events);
      const upcomingEvents = filterUpcomingEvents(sortEvents(events));
      setClasses(
        upcomingEvents
          .filter((event: any) => event.eventType === "CLASS")
          .slice(0, 5),
      );
      setDeadlines(
        upcomingEvents
          .filter((event: any) => event.eventType === "DEADLINE")
          .slice(0, 5),
      );
      setExams(
        upcomingEvents
          .filter((event: any) => event.eventType === "EXAM")
          .slice(0, 5),
      );
      setOthers(
        upcomingEvents
          .filter((event: any) => event.eventType === "OTHERS")
          .slice(0, 5),
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch events");
    }
  };

  const handleCreateEvent = async () => {
    try {
      const newEvent = await addEvent(
        session?.user?.id || "",
        eventTypeInput,
        eventTitleInput,
        eventWeekInput,
        eventDayInput,
        formatToDatabase(eventStartTimeHourInput, eventStartTimeMinuteInput),
        formatToDatabase(eventEndTimeHourInput, eventEndTimeMinuteInput),
        eventVenueInput,
      );

      setEvents([...events, newEvent]);
      switch (newEvent.eventType) {
        case "CLASS":
          setClasses([...classes, newEvent]);
          break;
        case "DEADLINE":
          setDeadlines([...deadlines, newEvent]);
          break;
        case "EXAM":
          setExams([...exams, newEvent]);
          break;
        case "OTHERS":
          setOthers([...others, newEvent]);
          break;
      }

      toast.success("Event " + eventTitleInput + " created successfully!");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to create event. Please try again later.",
      );
    } finally {
      setAddEventDialogOpen(false);
    }
  };

  const updateEventList = (events: any[], updatedEvent: any) => {
    return events.map((event) =>
      event.eventId === updatedEvent.eventId ? updatedEvent : event,
    );
  };

  const syncCategorizedEvents = (
    previousEvents: any[],
    previousType: string,
    nextType: string,
    updatedEvent: any,
  ) => {
    if (previousType === updatedEvent.eventType) {
      return updateEventList(previousEvents, updatedEvent);
    }

    if (
      previousEvents.some((event) => event.eventId === updatedEvent.eventId)
    ) {
      return previousEvents.filter(
        (event) => event.eventId !== updatedEvent.eventId,
      );
    }

    return nextType === updatedEvent.eventType
      ? [...previousEvents, updatedEvent]
      : previousEvents;
  };

  const handleUpdateEvent = async () => {
    try {
      const updatedEvent = {
        ...selectedEvent,
        eventType: eventTypeInput,
        title: eventTitleInput,
        week: eventWeekInput,
        day: eventDayInput,
        startTime: formatToDatabase(
          eventStartTimeHourInput,
          eventStartTimeMinuteInput,
        ),
        endTime: formatToDatabase(
          eventEndTimeHourInput,
          eventEndTimeMinuteInput,
        ),
        venue: eventVenueInput,
      };

      await updateEvent(
        selectedEvent.eventId,
        eventTypeInput,
        eventTitleInput,
        eventWeekInput,
        eventDayInput,
        formatToDatabase(eventStartTimeHourInput, eventStartTimeMinuteInput),
        formatToDatabase(eventEndTimeHourInput, eventEndTimeMinuteInput),
        eventVenueInput,
      );

      toast.success("Event " + eventTitleInput + " updated successfully!");
      setEvents((previousEvents) =>
        updateEventList(previousEvents, updatedEvent),
      );
      setClasses((previousEvents) =>
        syncCategorizedEvents(
          previousEvents,
          selectedEvent.eventType,
          "CLASS",
          updatedEvent,
        ),
      );
      setDeadlines((previousEvents) =>
        syncCategorizedEvents(
          previousEvents,
          selectedEvent.eventType,
          "DEADLINE",
          updatedEvent,
        ),
      );
      setExams((previousEvents) =>
        syncCategorizedEvents(
          previousEvents,
          selectedEvent.eventType,
          "EXAM",
          updatedEvent,
        ),
      );
      setOthers((previousEvents) =>
        syncCategorizedEvents(
          previousEvents,
          selectedEvent.eventType,
          "OTHER",
          updatedEvent,
        ),
      );
    } catch (error: any) {
      toast.error(
        error.message || "Failed to update event. Please try again later.",
      );
    } finally {
      setEventInfoDialogOpen(false);
      setEditEventDialogOpen(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedEvent.eventId);
      toast.success("Event " + selectedEvent.title + " deleted successfully!");
      setEvents(
        events.filter((event) => event.eventId !== selectedEvent.eventId),
      );
      setClasses(
        classes.filter((event) => event.eventId !== selectedEvent.eventId),
      );
      setDeadlines(
        deadlines.filter((event) => event.eventId !== selectedEvent.eventId),
      );
      setExams(
        exams.filter((event) => event.eventId !== selectedEvent.eventId),
      );
      setOthers(
        others.filter((event) => event.eventId !== selectedEvent.eventId),
      );
    } catch (error: any) {
      toast.error(
        error.message || "Failed to delete event. Please try again later.",
      );
    } finally {
      setEventInfoDialogOpen(false);
      setDeleteEventDialogOpen(false);
    }
  };

  const onPageStart = async () => {
    if (!session?.user?.id) {
      return;
    }
    await getAllEvents();
  };

  useEffect(() => {
    onPageStart();
  }, [session?.user?.id]);

  return (
    <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6">
      <div className="font-heading text-4xl font-bold">Scheduler</div>
      <ScheduleCalendar
        events={events}
        onEventClick={handleEventClick}
        onAddEventClick={() => setAddEventDialogOpen(true)}
      />

      <div>
        <p className="font-sans font-semibold text-lg">Classes</p>
        <div className="h-[0.5px] w-full bg-gray-300"></div>
        <EventList events={classes} />
      </div>
      <div>
        <p className="font-sans font-semibold text-lg">Deadlines</p>
        <div className="h-[0.5px] w-full bg-gray-300"></div>
        <EventList events={deadlines} />
      </div>
      <div>
        <p className="font-sans font-semibold text-lg">Exams</p>
        <div className="h-[0.5px] w-full bg-gray-300"></div>
        <EventList events={exams} />
      </div>
      <div>
        <p className="font-sans font-semibold text-lg">Other Events</p>
        <div className="h-[0.5px] w-full bg-gray-300"></div>
        <EventList events={others} />
      </div>

      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={setAddEventDialogOpen}
        eventTitleInput={eventTitleInput}
        setEventTitleInput={setEventTitleInput}
        eventTypeInput={eventTypeInput}
        setEventTypeInput={setEventTypeInput}
        eventWeekInput={eventWeekInput}
        setEventWeekInput={setEventWeekInput}
        eventDayInput={eventDayInput}
        setEventDayInput={setEventDayInput}
        eventStartTimeHourInput={eventStartTimeHourInput}
        setEventStartTimeHourInput={setEventStartTimeHourInput}
        eventStartTimeMinuteInput={eventStartTimeMinuteInput}
        setEventStartTimeMinuteInput={setEventStartTimeMinuteInput}
        eventEndTimeHourInput={eventEndTimeHourInput}
        setEventEndTimeHourInput={setEventEndTimeHourInput}
        eventEndTimeMinuteInput={eventEndTimeMinuteInput}
        setEventEndTimeMinuteInput={setEventEndTimeMinuteInput}
        eventVenueInput={eventVenueInput}
        setEventVenueInput={setEventVenueInput}
        onCreate={handleCreateEvent}
      />

      <EventInfoDialog
        open={eventInfoDialogOpen}
        onOpenChange={setEventInfoDialogOpen}
        event={selectedEvent}
        onEditEventClick={() =>
          selectedEvent.eventType === "CLASS"
            ? toast.warning("Classes are non-editable")
            : setEditEventDialogOpen(true)
        }
        onDeleteEventClick={() => setDeleteEventDialogOpen(true)}
        onAgentButtonClick={() => setAgentChatDialogOpen(true)}
      />

      <EditEventDialog
        open={editEventDialogOpen}
        onOpenChange={setEditEventDialogOpen}
        event={selectedEvent}
        eventTitleInput={eventTitleInput}
        setEventTitleInput={setEventTitleInput}
        eventTypeInput={eventTypeInput}
        setEventTypeInput={setEventTypeInput}
        eventWeekInput={eventWeekInput}
        setEventWeekInput={setEventWeekInput}
        eventDayInput={eventDayInput}
        setEventDayInput={setEventDayInput}
        eventStartTimeHourInput={eventStartTimeHourInput}
        setEventStartTimeHourInput={setEventStartTimeHourInput}
        eventStartTimeMinuteInput={eventStartTimeMinuteInput}
        setEventStartTimeMinuteInput={setEventStartTimeMinuteInput}
        eventEndTimeHourInput={eventEndTimeHourInput}
        setEventEndTimeHourInput={setEventEndTimeHourInput}
        eventEndTimeMinuteInput={eventEndTimeMinuteInput}
        setEventEndTimeMinuteInput={setEventEndTimeMinuteInput}
        eventVenueInput={eventVenueInput}
        setEventVenueInput={setEventVenueInput}
        onUpdate={handleUpdateEvent}
      />

      <DeleteEventDialog
        open={deleteEventDialogOpen}
        onOpenChange={setDeleteEventDialogOpen}
        onDelete={handleDeleteEvent}
      />

      <AgentChatDialog
        open={agentChatDialogOpen}
        onOpenChange={setAgentChatDialogOpen}
        event={selectedEvent}
      />
    </div>
  );
}
