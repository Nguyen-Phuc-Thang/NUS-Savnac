"use client";

// React Hooks
import { useEffect, useState } from "react";

// UI Components
import FullCalendar from "@fullcalendar/react";
import { Button } from "@/components/ui/button";
import { weeks } from "@/lib/constants/time";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

// Utils
import { modifyEvent } from "@/lib/utils/event";

interface ScheduleCalendarProps {
    events: any[];
    onEventClick: (info: any) => void;
    onAddClassClick?: () => void;
    onAddEventClick?: () => void;
}
export default function ScheduleCalendar({ events, onEventClick, onAddClassClick, onAddEventClick }: ScheduleCalendarProps) {

    const [currentWeek, setCurrentWeek] = useState<string>("Week 1");
    const [eventsToDisplay, setEventsToDisplay] = useState<any[]>([]);

    const handleWeekChange = (newWeek: string) => {
        setCurrentWeek(newWeek);
        setEventsToDisplay(events.filter(event => event.week === newWeek).map(event => modifyEvent(event)));
    }

    const handlePrevWeek = async () => {
        const currentWeekIndex = weeks.indexOf(currentWeek);
        if (currentWeekIndex == 0) return;
        handleWeekChange(weeks[currentWeekIndex - 1]);
    }

    const handleNextWeek = async () => {
        const currentWeekIndex = weeks.indexOf(currentWeek);
        if (currentWeekIndex == weeks.length - 1) return;
        handleWeekChange(weeks[currentWeekIndex + 1]);
    }

    useEffect(() => {
        handleWeekChange(currentWeek);
    }, [events]);

    return (
        <div>
            <div className='mt-5 font-sans flex flex-row items-center'>
                <Combobox items={weeks} value={currentWeek} onValueChange={(value) => handleWeekChange(value ?? "")}>
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
                <div className='font-sans ml-5'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex flex-row items-center justify-center font-sans px-2 py-2 rounded-md border hover:bg-primary hover:text-white shadow-sm transition-colors">
                            <Plus className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="font-sans mt-1" onClick={onAddClassClick}>
                                NUS Class
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-sans mt-2 mb-1" onClick={onAddEventClick}>
                                Custom Event
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className='mt-10'>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    initialDate="2026-06-01"
                    firstDay={1}
                    slotMinTime="06:00:00"
                    slotMaxTime="23:00:00"
                    headerToolbar={false}
                    dayHeaderFormat={{
                        weekday: "short"
                    }}
                    events={eventsToDisplay}
                    eventClick={onEventClick}
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
        </div>
    );

}