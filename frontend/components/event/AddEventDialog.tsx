"use client";

// React Hooks
import { useEffect } from "react";

// UI Components
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Utils
import { eventTypes } from "@/lib/constants/event";
import { weeks, days } from "@/lib/constants/time";

interface AddEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventTitleInput: string;
    setEventTitleInput: (value: string) => void;
    eventTypeInput: typeof eventTypes[number];
    setEventTypeInput: (value: typeof eventTypes[number]) => void;
    eventWeekInput: string;
    setEventWeekInput: (value: string) => void;
    eventDayInput: string;
    setEventDayInput: (value: string) => void;
    eventStartTimeHourInput: string;
    setEventStartTimeHourInput: (value: string) => void;
    eventStartTimeMinuteInput: string;
    setEventStartTimeMinuteInput: (value: string) => void;
    eventEndTimeHourInput: string;
    setEventEndTimeHourInput: (value: string) => void;
    eventEndTimeMinuteInput: string;
    setEventEndTimeMinuteInput: (value: string) => void;
    eventVenueInput: string;
    setEventVenueInput: (value: string) => void;
    onCreate: () => void;
}

export default function AddEventDialog({
    open,
    onOpenChange,
    eventTitleInput,
    setEventTitleInput,
    eventTypeInput,
    setEventTypeInput,
    eventWeekInput,
    setEventWeekInput,
    eventDayInput,
    setEventDayInput,
    eventStartTimeHourInput,
    setEventStartTimeHourInput,
    eventStartTimeMinuteInput,
    setEventStartTimeMinuteInput,
    eventEndTimeHourInput,
    setEventEndTimeHourInput,
    eventEndTimeMinuteInput,
    setEventEndTimeMinuteInput,
    eventVenueInput,
    setEventVenueInput,
    onCreate
}: AddEventDialogProps) {

    useEffect(() => {
        setEventTitleInput("");
        setEventTypeInput("CLASS");
        setEventWeekInput("");
        setEventDayInput("");
        setEventStartTimeHourInput("");
        setEventStartTimeMinuteInput("");
        setEventEndTimeHourInput("");
        setEventEndTimeMinuteInput("");
        setEventVenueInput("");
    }, [open]);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                        <Combobox items={eventTypes} value={eventTypeInput} onValueChange={(value) => setEventTypeInput(value ?? "CLASS")}>
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
                    <Button onClick={onCreate} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}