"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { info } from "console";

function EventList({ events }: { events: any[] }) {
    return (
        <div>
            <div>
                <div className="flex flex-row w-full mt-2 font-semibold">
                    <div className='w-[35%] border-b-4 py-2'>Time</div>
                    <div className='w-[20%] border-b-4 py-2'>Course</div>
                    <div className='w-[20%] border-b-4 py-2'>Title</div>
                    <div className='w-[25%] border-b-4 py-2'>Venue</div>
                </div>
            </div>
            <div className='mt-5'></div>
            <div>
                {
                    events.map((event: any) => (
                        <div key={event.id} className="flex flex-row w-full mt-4 font-sans hover:bg-gray-100 rounded-md p-2">
                            <div className='w-[10%] text-center'>{event.week}</div>
                            <div className='w-[10%] text-center'>{event.day}</div>
                            <div className='w-[15%] text-center '>{event.startTime.slice(0, 2)}:{event.startTime.slice(2, 4)} - {event.endTime.slice(0, 2)}:{event.endTime.slice(2, 4)}</div>
                            <div className='w-[20%]'>{event.course ? event.course.courseCode : "No course related"}</div>
                            <div className='w-[20%] font-bold'>{event.title}</div>
                            <div className='w-[25%]'>{event.venue}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default function SchedulerPage() {
    const { data: session } = useSession();

    const currentWeek = "Week 2";
    const currentDay = "Wednesday";
    const currentTime = "12:30:00";

    const weeks: string[] = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Recess Week", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13", "Reading Week", "Exam Week"] as const;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
    const eventTypes = ["CLASS", "DEADLINE", "EXAM", "OTHERS"] as const;
    const eventTypeColors: { [key in typeof eventTypes[number]]: string } = {
        "CLASS": "#60A5FA", // blue-360
        "DEADLINE": "#F87171", // red-300
        "EXAM": "#FBBF24", // yellow-300
        "OTHERS": "#34D399" // green-300
    }

    const [events, setEvents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [deadlines, setDeadlines] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [others, setOthers] = useState<any[]>([]);
    const [currentWeekSelected, setCurrentWeekSelected] = useState<string>(currentWeek);

    const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
    const [isEventInfoOpen, setIsEventInfoOpen] = useState(false);
    const [eventTitleInput, setEventTitleInput] = useState("");
    const [eventTypeInput, setEventTypeInput] = useState("");
    const [eventWeekInput, setEventWeekInput] = useState("");
    const [eventDayInput, setEventDayInput] = useState("");
    const [eventStartTimeHourInput, setEventStartTimeHourInput] = useState("");
    const [eventStartTimeMinuteInput, setEventStartTimeMinuteInput] = useState("");
    const [eventEndTimeHourInput, setEventEndTimeHourInput] = useState("");
    const [eventEndTimeMinuteInput, setEventEndTimeMinuteInput] = useState("");
    const [eventVenueInput, setEventVenueInput] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const handleWeekChange = async (week: string) => {
        setCurrentWeekSelected(week);
        const filteredEvents = events.filter((event: any) => event.week === week);
        const modifiedEvents = await modifyEventsForCalendar(filteredEvents);
        setDisplayedEvents(modifiedEvents);
    }

    const handlePrevWeek = async () => {
        const currentWeekIndex = weeks.indexOf(currentWeekSelected);
        if (currentWeekIndex > 0) {
            const newWeek = weeks[currentWeekIndex - 1];
            handleWeekChange(newWeek);
        }
    }

    const handleNextWeek = async () => {
        const currentWeekIndex = weeks.indexOf(currentWeekSelected);
        if (currentWeekIndex < weeks.length - 1) {
            const newWeek = weeks[currentWeekIndex + 1];
            handleWeekChange(newWeek);
        }
    }

    const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);

    const sortEvents = async (events: any[]) => {
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

    const filterUpcomingEvents = async (events: any[]) => {
        return events.filter((event: any) => {
            const eventWeekIndex = weeks.indexOf(event.week);
            const eventDayIndex = days.indexOf(event.day);
            const currentWeekIndex = weeks.indexOf(currentWeek);
            const currentDayIndex = days.indexOf(currentDay);
            const eventStartTime = event.startTime;
            return (currentWeekIndex < eventWeekIndex)
                || (currentWeekIndex === eventWeekIndex && currentDayIndex < eventDayIndex)
                || (currentWeekIndex === eventWeekIndex && currentDayIndex === eventDayIndex && currentTime.localeCompare(eventStartTime) < 0);
        });
    }

    const modifyEventsForCalendar = async (events: any[]) => {
        let modifiedEvents = [];
        for (const event of events) {
            const startTime = "2026-06-0" + (days.indexOf(event.day) + 1) + "T" + event.startTime.slice(0, 2) + ":" + event.startTime.slice(2, 4) + ":00";
            const endTime = "2026-06-0" + (days.indexOf(event.day) + 1) + "T" + event.endTime.slice(0, 2) + ":" + event.endTime.slice(2, 4) + ":00";

            modifiedEvents.push({
                title: event.title,
                start: startTime,
                end: endTime,
                backgroundColor: eventTypeColors[event.eventType as typeof eventTypes[number]],
                extendedProps: {
                    venue: event.venue,
                    course: event.course ? event.course.courseCode : null,
                    week: event.week,
                    day: event.day,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    eventId: event.eventId,
                },
            });
        }

        return modifiedEvents;
    }

    const getAllEvents = async () => {
        try {
            const events = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/get-events-by-user-id?userId=${session?.user?.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            setEvents(events);
            const sortedEvents = await sortEvents(events);
            const upcomingEvents = await filterUpcomingEvents(sortedEvents);

            setClasses(upcomingEvents.filter((event: any) => event.eventType === "CLASS").slice(0, 5));
            setDeadlines(upcomingEvents.filter((event: any) => event.eventType === "DEADLINE").slice(0, 5));
            setExams(upcomingEvents.filter((event: any) => event.eventType === "EXAM").slice(0, 5));
            setOthers(upcomingEvents.filter((event: any) => event.eventType === "OTHERS").slice(0, 5));

        } catch (error: any) {
            toast.error(error.message || "Failed to fetch events");
        }
    }

    const handleCreateEvent = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/add-event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    eventType: eventTypeInput,
                    eventTitle: eventTitleInput,
                    eventWeek: eventWeekInput,
                    eventDay: eventDayInput,
                    eventStartTime: `${parseInt(eventStartTimeHourInput) <= 9 ? `0${eventStartTimeHourInput}` : eventStartTimeHourInput}${parseInt(eventStartTimeMinuteInput) <= 9 ? `0${eventStartTimeMinuteInput}` : eventStartTimeMinuteInput}`,
                    eventEndTime: `${parseInt(eventEndTimeHourInput) <= 9 ? `0${eventEndTimeHourInput}` : eventEndTimeHourInput}${parseInt(eventEndTimeMinuteInput) <= 9 ? `0${eventEndTimeMinuteInput}` : eventEndTimeMinuteInput}`,
                    eventVenue: eventVenueInput,
                })
            }).then((res) => res.json());

            if (!response.eventId) {
                throw new Error("Failed to create event. Please try again later.");
            } else {
                toast.success("Event " + eventTitleInput + " created successfully!");
                setIsNewEventDialogOpen(false);
                setEventTitleInput("");
                setEventTypeInput("");
                setEventWeekInput("");
                setEventDayInput("");
                setEventStartTimeHourInput("");
                setEventStartTimeMinuteInput("");
                setEventEndTimeHourInput("");
                setEventEndTimeMinuteInput("");
                setEventVenueInput("");
                await getAllEvents();
                await handleWeekChange(currentWeekSelected);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create event. Please try again later.");
        }
    }

    const handleDeleteEvent = async (eventId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/delete-event`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventId,
                })
            }).then((res) => res.json());

            await getAllEvents();
            await handleWeekChange(currentWeekSelected);
            setIsEventInfoOpen(false);

        } catch (error: any) {
            toast.error(error.message || "Failed to delete event. Please try again later.");
        }
    }

    const onPageStart = async () => {
        if (!session?.user?.id) {
            return;
        }
        await getAllEvents();
        await handleWeekChange(currentWeek);
    }

    useEffect(() => {
        onPageStart();
    }, [session?.user?.id]);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6">
            <div className="font-heading text-4xl font-bold">Scheduler</div>
            <div className='mt-5 w-60 font-sans flex flex-row'>
                <Combobox items={weeks} value={currentWeekSelected} onValueChange={(value) => handleWeekChange(value ?? "")}>
                    <ComboboxInput placeholder="Select a week" />
                    <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList className="max-h-none">
                            {(item) => (
                                <ComboboxItem className='font-sans' key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
                <Button className='ml-5 bg-white text-black border shadow-sm transition-colors hover:bg-white' onClick={handlePrevWeek}><ChevronLeft /></Button>
                <Button className='ml-2 bg-white text-black border shadow-sm transition-colors hover:bg-white' onClick={handleNextWeek}><ChevronRight /></Button>
                <Button className='ml-2 bg-white text-black border shadow-sm transition-colors hover:bg-white' onClick={() => setIsNewEventDialogOpen(true)}><Plus /></Button>
            </div>
            <div>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    initialDate="2026-06-01"
                    firstDay={1}
                    slotMinTime="04:00:00"
                    slotMaxTime="23:00:00"
                    headerToolbar={false}
                    dayHeaderFormat={{
                        weekday: "short"
                    }}
                    events={displayedEvents}

                    eventClick={(info) => {
                        setSelectedEvent({
                            title: info.event.title,
                            course: info.event.extendedProps.course,
                            venue: info.event.extendedProps.venue,
                            week: info.event.extendedProps.week,
                            day: info.event.extendedProps.day,
                            startTime: info.event.extendedProps.startTime.slice(0, 2) + ":" + info.event.extendedProps.startTime.slice(2, 4),
                            endTime: info.event.extendedProps.endTime.slice(0, 2) + ":" + info.event.extendedProps.endTime.slice(2, 4),
                            eventId: info.event.extendedProps.eventId
                        });
                        setIsEventInfoOpen(true);
                    }}

                    eventContent={
                        (info) => (
                            <div className="overflow-hidden text-xs">
                                <div className="font-semibold">
                                    {info.event.title}
                                </div>
                                <div>
                                    {info.event.extendedProps.course}
                                </div>
                                <div>
                                    {info.event.extendedProps.venue}
                                </div>
                            </div>
                        )
                    }
                />
            </div>


            <div>
                <p className='font-sans font-semibold text-lg'>Classes</p>
                <div className='h-[0.5px] w-full bg-gray-300'></div>
                <EventList events={classes} />
            </div>
            <div>
                <p className='font-sans font-semibold text-lg'>Deadlines</p>
                <div className='h-[0.5px] w-full bg-gray-300'></div>
                <EventList events={deadlines} />
            </div>
            <div>
                <p className='font-sans font-semibold text-lg'>Exams</p>
                <div className='h-[0.5px] w-full bg-gray-300'></div>
                <EventList events={exams} />
            </div>
            <div>
                <p className='font-sans font-semibold text-lg'>Other Events</p>
                <div className='h-[0.5px] w-full bg-gray-300'></div>
                <EventList events={others} />
            </div>

            <Dialog open={isEventInfoOpen} onOpenChange={setIsEventInfoOpen}>
                <DialogContent className="w-[50vw] max-w-none">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-2xl">{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    <div>
                        <div className="font-sans">Start: {selectedEvent?.week}, {selectedEvent?.day} {selectedEvent?.startTime}</div>
                        <div className="mt-5 font-sans">End: {selectedEvent?.week}, {selectedEvent?.day} {selectedEvent?.endTime}</div>
                        <div className="mt-5 font-sans">Venue: {selectedEvent?.venue}</div>
                    </div>

                    <DialogFooter>
                        <Button className='font-sans bg-secondary hover:bg-primary' onClick={() => handleDeleteEvent(selectedEvent?.eventId)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>

            <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
                <DialogContent className="w-[50vw] max-w-none">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-2xl">Create New Event</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Field className="w-full">
                            <FieldLabel className="font-sans text-md">Event Title</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Enter event title"
                                className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                value={eventTitleInput}
                                onChange={(e) => setEventTitleInput(e.target.value)}
                            />
                        </Field>

                        <div className="w-full mt-4 font-sans">
                            <p className="font-semibold mb-2">Event Type</p>
                            <Combobox items={eventTypes} value={eventTypeInput} onValueChange={(value) => setEventTypeInput(value ?? "")}>
                                <ComboboxInput placeholder="Select an event type" />
                                <ComboboxContent>
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                                    <ComboboxList className="max-h-none">
                                        {(item) => (
                                            <ComboboxItem className='font-sans' key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        <div className="w-full mt-4 font-sans">
                            <p className="font-semibold mb-2">Week</p>
                            <Combobox items={weeks} value={eventWeekInput} onValueChange={(value) => setEventWeekInput(value ?? "")}>
                                <ComboboxInput placeholder="Select a week" />
                                <ComboboxContent>
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                                    <ComboboxList className="max-h-none">
                                        {(item) => (
                                            <ComboboxItem className='font-sans' key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        <div className="w-full mt-4 font-sans">
                            <p className="font-semibold mb-2">Day</p>
                            <Combobox items={days} value={eventDayInput} onValueChange={(value) => setEventDayInput(value ?? "")}>
                                <ComboboxInput placeholder="Select a day" />
                                <ComboboxContent>
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                                    <ComboboxList className="max-h-none">
                                        {(item) => (
                                            <ComboboxItem className='font-sans' key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        <div className="w-full mt-4 font-sans flex flex-row gap-10" >
                            <div>
                                <p className="font-sans font-semibold mt-4 mb-2">Start Time</p>
                                <div>
                                    <Input
                                        type="number"
                                        placeholder="HH"
                                        className="w-20 font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                        value={eventStartTimeHourInput}
                                        onChange={(e) => setEventStartTimeHourInput(e.target.value)}
                                    />
                                    <span className="mx-2">:</span>
                                    <Input
                                        type="number"
                                        placeholder="MM"
                                        className="w-20 font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                        value={eventStartTimeMinuteInput}
                                        onChange={(e) => setEventStartTimeMinuteInput(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-sans font-semibold mt-4 mb-2">End Time</p>
                                <div>
                                    <Input
                                        type="number"
                                        placeholder="HH"
                                        className="w-20 font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                        value={eventEndTimeHourInput}
                                        onChange={(e) => setEventEndTimeHourInput(e.target.value)}
                                    />
                                    <span className="mx-2">:</span>
                                    <Input
                                        type="number"
                                        placeholder="MM"
                                        className="w-20 font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                        value={eventEndTimeMinuteInput}
                                        onChange={(e) => setEventEndTimeMinuteInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Field className="w-full mt-5">
                            <FieldLabel className="font-sans text-md">Venue</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Enter event venue"
                                className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                value={eventVenueInput}
                                onChange={(e) => setEventVenueInput(e.target.value)}
                            />
                        </Field>

                    </div>
                    <DialogFooter>
                        <Button onClick={() => { handleCreateEvent() }} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}