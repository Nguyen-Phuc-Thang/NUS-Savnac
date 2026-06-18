"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Folder, FolderClosed, FolderOpen, Plus, Link, CalendarDays, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { restructureClasses, splitToWeekAndDays } from "@/lib/utils/scheduleManipulation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Checkbox } from "@/components/ui/checkbox";


interface FolderType {
    folderId: string;
    name: string;
    description: string;
    isOpen?: boolean;
}

interface LinkType {
    linkId: string;
    folderId: string;
    title: string;
    url: string;
}

enum EventType {
    NUS = 'NUS',
    NONNUS = 'NONNUS'
}

export default function CoursePage() {
    const params = useParams();
    const { data: session } = useSession();

    // UI states
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isNewLinkDialogOpen, setIsNewLinkDialogOpen] = useState(false);
    const [isNewClassDialogOpen, setIsNewClassDialogOpen] = useState(false);
    const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
    const [folderNameInput, setFolderNameInput] = useState("");
    const [folderDescriptionInput, setFolderDescriptionInput] = useState("");
    const [linkTitleInput, setLinkTitleInput] = useState("");
    const [linkUrlInput, setLinkUrlInput] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [classSearchQuery, setClassSearchQuery] = useState("");
    const [eventTitleInput, setEventTitleInput] = useState("");
    const [eventTypeInput, setEventTypeInput] = useState("");
    const [eventWeekInput, setEventWeekInput] = useState("");
    const [eventDayInput, setEventDayInput] = useState("");
    const [eventStartTimeHourInput, setEventStartTimeHourInput] = useState("");
    const [eventStartTimeMinuteInput, setEventStartTimeMinuteInput] = useState("");
    const [eventEndTimeHourInput, setEventEndTimeHourInput] = useState("");
    const [eventEndTimeMinuteInput, setEventEndTimeMinuteInput] = useState("");
    const [eventVenueInput, setEventVenueInput] = useState("");
    const weeks: string[] = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Recess Week", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13", "Reading Week", "Exam Week"] as const;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
    const timeSlots = Array.from({ length: 24 }, (_, i) => (i <= 9 ? `0${i}` : i));

    // Data states
    const [courseData, setCourseData] = useState<any>(null);
    const [workloadComponents, setWorkloadComponents] = useState<any>([]);
    const workloadBarLength = 500; // in pixels

    const getCourseData = async () => {
        try {
            const dataFromNUS = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/course-data/${params.courseCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            const dataFromDatabase = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/user-course?courseCode=${params.courseCode}&userId=${session?.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => res.json());
            const fullCourseData = { courseId: dataFromDatabase?.courseId, ...dataFromNUS };
            setCourseData(fullCourseData);
            setWorkloadComponents([
                { type: "Lecture", hours: dataFromNUS.workload[0], color: "bg-blue-300" },
                { type: "Tutorial", hours: dataFromNUS.workload[1], color: "bg-green-300" },
                { type: "Lab", hours: dataFromNUS.workload[2], color: "bg-red-300" },
                { type: "Project", hours: dataFromNUS.workload[3], color: "bg-purple-300" },
                { type: "Preparation", hours: dataFromNUS.workload[4], color: "bg-yellow-300" }
            ]);
            setCourseTimetable(restructureClasses(dataFromNUS.semesterData[1]));
            return fullCourseData;
        }
        catch (error: any) {
            toast.error(error.message || "Failed to fetch course data. Please try again later.");
        }
    }

    // Folder states and handlers
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null);

    const getAllFolders = async (courseId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/all-folders?courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            console.log("Fetched folders:", response);
            const foldersWithOpenState = response.map((folder: any) => ({
                ...folder,
                isOpen: false
            }));
            setFolders(foldersWithOpenState);
            return response;
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch folders. Please try again later.");
        }
    }

    const handleCreateFolder = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/create-folder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: courseData.courseId,
                    folderName: folderNameInput,
                    folderDescription: folderDescriptionInput
                }),
            }).then((res) => res.json());

            if (response.folderId) {
                toast.success("Folder " + folderNameInput + " created successfully!");
                setIsNewFolderDialogOpen(false);
                setFolderNameInput("");
                setFolderDescriptionInput("");
                fetchData();
            } else {
                throw new Error("Failed to create folder. Please try again later.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create folder. Please try again later.");
        }
    }

    const handleFolderClick = async (folderIndex: number) => {
        const newFolders = [...folders];
        const newState = !newFolders[folderIndex].isOpen;
        setIsPanelOpen(newState);
        newFolders.map((folder) => folder.isOpen = false);
        newFolders[folderIndex].isOpen = newState;

        if (newState) {
            setCurrentFolder(newFolders[folderIndex]);
        } else {
            setCurrentFolder(null);
        }
        setFolders(newFolders);
        console.log(folders);
    }


    // Link handlers
    const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false);
    const [generalLinks, setGeneralLinks] = useState<LinkType[]>([]);
    const [currentFolderLinks, setCurrentFolderLinks] = useState<LinkType[]>([]);
    const handleCreateLink = async (isGeneral: boolean) => {
        const targetFolder = isGeneral ? folders.find(folder => folder.name === '__general__') : currentFolder;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/create-link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    folderId: targetFolder?.folderId,
                    title: linkTitleInput,
                    url: linkUrlInput,
                })
            }).then((res) => res.json());

            if (response.linkId) {
                toast.success("Link " + linkTitleInput + " created successfully!");
                setIsNewLinkDialogOpen(false);
                setLinkTitleInput("");
                setLinkUrlInput("");
                if (isGeneral) {
                    fetchData();
                } else {
                    await getAllLinks(targetFolder?.folderId || "", false);
                }
            } else {
                throw new Error("Failed to create link. Please try again later.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create link. Please try again later.");
        }
    }

    const getAllLinks = async (folderId: string, isGeneral: boolean) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/links-by-folder?folderId=${folderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            if (isGeneral) {
                setGeneralLinks(response);
            } else {
                setCurrentFolderLinks(response);
            }

            return response;
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch links. Please try again later.");
        }

    }



    // Schedule handlers
    const eventTypes = ["CLASS", "DEADLINE", "EXAM", "OTHERS"] as const;
    const eventTypeColors: { [key in typeof eventTypes[number]]: string } = {
        "CLASS": "#60A5FA", // blue-360
        "DEADLINE": "#F87171", // red-300
        "EXAM": "#FBBF24", // yellow-300
        "OTHERS": "#34D399" // green-300
    }
    const [events, setEvents] = useState<any[]>([]);
    const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
    const [courseTimetable, setCourseTimetable] = useState<any>([]);
    const getAllEvents = async (courseId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/get-events-by-course-id?courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            if (Array.isArray(response)) {
                setEvents(response);
                handleWeekChange(currentWeekSelected);
            }
            else {
                throw new Error("Failed to fetch events. Please try again later.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch events. Please try again later.");
        }
    }

    const handleAddClass = async (classData: any) => {
        setIsNewClassDialogOpen(false);
        setClassSearchQuery("");
        try {
            for (const week of classData.weeks) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/add-event`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: session?.user?.id,
                        eventType: "CLASS",
                        eventTitle: classData.classNo,
                        eventWeek: "Week " + week.toString(),
                        eventDay: classData.day,
                        eventStartTime: classData.startTime,
                        eventEndTime: classData.endTime,
                        eventVenue: classData.venue,
                        courseId: courseData.courseId
                    })
                }).then((res) => res.json());

                if (!response.eventId) {
                    throw new Error("Failed to add class. Please try again later.");
                }
            }
            toast.success("Class " + classData.classNo + " added successfully!");
            await getAllEvents(courseData.courseId);
        } catch (error) {
            toast.error("Failed to add class. Please try again later.");
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
                    courseId: courseData.courseId
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
                getAllEvents(courseData.courseId);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create event. Please try again later.");
        }
    }


    const [currentWeekSelected, setCurrentWeekSelected] = useState("Week 1");
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const handleWeekChange = (week: string) => {
        console.log(events);
        const weekEvents = events.filter((event) => event.week === week);
        console.log("Events for " + week, weekEvents);
        let modifiedEvents = [];
        for (const event of weekEvents) {
            const startTime = "2026-06-0" + (days.indexOf(event.day) + 1) + "T" + event.startTime.slice(0, 2) + ":" + event.startTime.slice(2, 4) + ":00";
            const endTime = "2026-06-0" + (days.indexOf(event.day) + 1) + "T" + event.endTime.slice(0, 2) + ":" + event.endTime.slice(2, 4) + ":00";

            modifiedEvents.push({
                title: event.title,
                start: startTime,
                end: endTime,
                backgroundColor: eventTypeColors[event.eventType as typeof eventTypes[number]],
            });
        }
        console.log(modifiedEvents);
        setDisplayedEvents(modifiedEvents);
        setCurrentWeekIndex(weeks.indexOf(week));
        setCurrentWeekSelected(week);
    }

    const handlePrevWeek = () => {
        if (currentWeekIndex > 0) {
            const newWeek = weeks[currentWeekIndex - 1];
            handleWeekChange(newWeek);
        }
    }

    const handleNextWeek = () => {
        if (currentWeekIndex < weeks.length - 1) {
            const newWeek = weeks[currentWeekIndex + 1];
            handleWeekChange(newWeek);
        }
    }

    // Tasks states and handlers
    const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
    const [todayTasks, setTodayTasks] = useState<any[]>([]);
    const [taskNameQuery, setTaskNameQuery] = useState("");
    const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});
    const [isEnteringWeeklyTask, setIsEnteringWeeklyTask] = useState(false);
    const [isEnteringTodayTask, setIsEnteringTodayTask] = useState(false);

    const getAllTasks = async (courseId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/get-all-tasks-by-course?courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const tasks = await response.json();
            setWeeklyTasks(tasks.filter((task: any) => task.taskType === "WEEKLY"));
            setTodayTasks(tasks.filter((task: any) => task.taskType === "TODAY"));
            setCheckedStates(tasks.reduce((acc: any, task: any) => {
                acc[task.taskId] = task.completed;
                return acc;
            }, {}));
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    const addNewTask = async (taskType: string, taskName: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/create-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session?.user.id,
                    name: taskName,
                    taskType: taskType,
                    courseId: courseData.courseId
                })
            });
            const newTask = await response.json();
            setTaskNameQuery("");
            if (taskType === "WEEKLY") {
                setIsEnteringWeeklyTask(false);
            } else {
                setIsEnteringTodayTask(false);
            }
            await getAllTasks(courseData.courseId);

        } catch (error) {
            toast.error("Failed to create task. Please try again later.");
        }
    }

    const toggleTaskCompletion = async (taskId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/toggle-task?taskId=${taskId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const updatedTask = await response.json();
            await getAllTasks(courseData.courseId);
        } catch (error) {
            toast.error("Failed to update task completion status. Please try again later.");
        }
    }

    const fetchData = async () => {
        console.log(timeSlots)
        if (params.courseCode) {
            const courseData = await getCourseData();
            const foldersData = await getAllFolders(courseData.courseId);
            await getAllLinks(foldersData.find((f: any) => f.name === '__general__')?.folderId, true);
            await getAllEvents(courseData.courseId);
            await getAllTasks(courseData.courseId);
        }
    }

    useEffect(() => {
        fetchData();
    }, [params.courseCode, session?.user.id]);

    return (
        <div className="flex min-h-screen">
            <main className="flex min-w-0 flex-1 flex-col gap-4 ml-6 mt-6">
                <div className="flex flex-row">
                    <div>

                        <div className="font-heading text-4xl font-bold">{params.courseCode}</div>
                        <div className="font-sans text-lg text-muted-foreground">
                            {courseData?.title}
                        </div>

                        <section className="mt-5">
                            <div className="font-heading text-lg font-bold">Course Details</div>
                            <div className="mt-2 font-sans text-muted-foreground">
                                <p>Credit: {courseData?.credit} units</p>
                            </div>
                            <div className="mt-2 font-sans text-muted-foreground flex flex-col gap-3">
                                <p className="font-sans text-muted-foreground">Workload</p>
                                <div className="flex flex-row items-center gap-1">
                                    {
                                        workloadComponents.map((component: any) => (
                                            <HoverCard key={component.type} openDelay={0} closeDelay={0}>
                                                <HoverCardTrigger>
                                                    <div className={`${component.color}`} style={{ width: `${(component.hours / 14) * workloadBarLength}px`, height: "20px" }}></div>
                                                </HoverCardTrigger>
                                                <HoverCardContent>
                                                    <p className="font-bold font-sans">{component.type}</p>
                                                    <p className="font-sans">{component.hours} hours / week</p>
                                                </HoverCardContent>
                                            </HoverCard>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="mt-3 font-sans text-muted-foreground flex flex-col gap-3">
                                <p className="font-sans text-muted-foreground">Components</p>
                            </div>
                        </section>
                    </div>
                    <div className='w-[1px] h-full bg-gray-300 ml-10'></div>
                    <div className='flex flex-col ml-4 w-1/4'>
                        <p className='font-heading'>Weekly Tasks</p>
                        <div className='mt-2 overflow-y-auto h-full'>
                            {
                                weeklyTasks.map((task) => (
                                    <div className='flex flex-row items-center' key={task.taskId}>
                                        <Checkbox checked={checkedStates[task.taskId]} onCheckedChange={() => toggleTaskCompletion(task.taskId)} />
                                        <p className='ml-2'>{task.name}</p>
                                    </div>
                                ))
                            }

                            {
                                isEnteringWeeklyTask ? (
                                    <div className='flex flex-row items-center justify-center mt-2'>
                                        <Input placeholder="Enter task name..." value={taskNameQuery} onChange={(e) => setTaskNameQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNewTask("WEEKLY", taskNameQuery)} />
                                        <Button className='ml-1 rounded-md bg-white hover:bg-white text-black border shadow-sm transition-colors' onClick={() => setIsEnteringWeeklyTask(false)}>
                                            <Minus />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className='mt-2 rounded-md bg-white hover:bg-white text-black border shadow-sm transition-colors' onClick={() => setIsEnteringWeeklyTask(true)}>
                                        <Plus />
                                    </Button>
                                )
                            }

                        </div>
                    </div>
                    <div className='w-[1px] h-full bg-gray-300 ml-3'></div>
                    <div className='flex flex-col ml-4 w-1/4'>
                        <p className='font-heading'>Today Tasks</p>
                        <div className='mt-2 overflow-y-auto h-full'>
                            {
                                todayTasks.map((task) => (
                                    <div className='flex flex-row items-center' key={task.taskId}>
                                        <Checkbox checked={checkedStates[task.taskId]} onCheckedChange={() => toggleTaskCompletion(task.taskId)} />
                                        <p className='ml-2'>{task.name}</p>
                                    </div>
                                ))
                            }

                            {
                                isEnteringTodayTask ? (
                                    <div className='flex flex-row items-center justify-center mt-2'>
                                        <Input placeholder="Enter task name..." value={taskNameQuery} onChange={(e) => setTaskNameQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNewTask("TODAY", taskNameQuery)} />
                                        <Button className='ml-1 rounded-md bg-white hover:bg-white text-black border shadow-sm transition-colors' onClick={() => setIsEnteringTodayTask(false)}>
                                            <Minus />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className='mt-2 rounded-md bg-white hover:bg-white text-black border shadow-sm transition-colors' onClick={() => setIsEnteringTodayTask(true)}>
                                        <Plus />
                                    </Button>
                                )
                            }

                        </div>
                    </div>
                </div >


                <section>
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <Folder className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Folders</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                    <div className='mt-4 flex flex-col gap-4'>
                        <Button onClick={() => setIsNewFolderDialogOpen(true)} className='w-30 font-sans px-4 py-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                            <Plus className="w-4 h-4" />
                            New Folder
                        </Button>
                    </div>
                    <div className='mt-10 grid grid-cols-[repeat(auto-fill,minmax(10rem,10rem))] justify-start gap-2'>
                        {
                            folders.map((folder, index) => (
                                folder.name == '__general__' ? null : (
                                    <div className='flex flex-col items-center' key={folder.folderId}>
                                        {folder.isOpen ? <FolderOpen onClick={() => handleFolderClick(index)} size={120} /> : <FolderClosed onClick={async () => { await getAllLinks(folder.folderId, false); await handleFolderClick(index) }} size={120} />}
                                        <div className='font-sans text-md text-center text-black mt-2'>
                                            {folder.name}
                                        </div>
                                    </div>
                                )
                            ))
                        }
                    </div>
                </section>

                <section className="mt-10">
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <Link className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Links</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                    <div className='mt-4 flex flex-col gap-4'>
                        <Button onClick={() => { setIsGeneralDialogOpen(true); setIsNewLinkDialogOpen(true) }} className='w-30 font-sans px-4 py-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                            <Plus className="w-4 h-4" />
                            New Link
                        </Button>
                    </div>
                    <div className='mt-10 grid grid-cols-[repeat(auto-fill,minmax(10rem,10rem))] justify-start gap-2'>
                        {/* Map through links here */}
                        {
                            generalLinks.map((link) => (
                                <a key={link.linkId} href={link.url} target="_blank" rel="noopener noreferrer">
                                    <Button key={link.linkId} variant="outline" className='font-sans text-left px-4 py-2 w-full'>
                                        {link.title}
                                    </Button>
                                </a>
                            ))
                        }
                    </div>
                </section>

                <section className="mt-10">
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <CalendarDays className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Schedule</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>

                    <div className='font-sans mt-5'>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex flex-row items-center justify-center font-sans px-4 py-1 rounded-md border hover:bg-primary hover:text-white shadow-sm transition-colors">
                                <Plus className="w-4 h-4 mr-2" />
                                Event
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="font-sans mt-1" onClick={() => setIsNewClassDialogOpen(true)}>
                                    NUS Class
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-sans mt-2 mb-1" onClick={() => setIsNewEventDialogOpen(true)}>
                                    Custom Event
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

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
                            events={displayedEvents}
                        />
                    </div>

                </section>


                <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                    <DialogContent className="w-[50vw] max-w-none">
                        <DialogHeader>
                            <DialogTitle className="font-heading text-2xl">Create New Folder</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Field className="w-full">
                                <FieldLabel className="font-sans text-md">Folder Name</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter folder name"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={folderNameInput}
                                    onChange={(e) => setFolderNameInput(e.target.value)}
                                />
                            </Field>
                            <Field className="w-full mt-4">
                                <FieldLabel className="font-sans text-md">Folder Description</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter folder description"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={folderDescriptionInput}
                                    onChange={(e) => setFolderDescriptionInput(e.target.value)}
                                />
                            </Field>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateFolder} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog >



                <Dialog open={isNewLinkDialogOpen} onOpenChange={setIsNewLinkDialogOpen}>
                    <DialogContent className="w-[50vw] max-w-none">
                        <DialogHeader>
                            <DialogTitle className="font-heading text-2xl">Create New Link</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Field className="w-full">
                                <FieldLabel className="font-sans text-md">Link Title</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter link title"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={linkTitleInput}
                                    onChange={(e) => setLinkTitleInput(e.target.value)}
                                />
                            </Field>
                            <Field className="w-full mt-4">
                                <FieldLabel className="font-sans text-md">Link URL</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter link URL"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={linkUrlInput}
                                    onChange={(e) => setLinkUrlInput(e.target.value)}
                                />
                            </Field>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => { handleCreateLink(isGeneralDialogOpen) }} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>

                <Dialog open={isNewClassDialogOpen} onOpenChange={setIsNewClassDialogOpen}>
                    <DialogContent className="w-[50vw] max-w-none">
                        <DialogHeader>
                            <DialogTitle className="font-heading text-2xl">Add NUS Class</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Field className="w-full">
                                <Input
                                    type="text"
                                    placeholder="Search by class code (e.g. LEC1)"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={classSearchQuery}
                                    onChange={(e) => setClassSearchQuery(e.target.value)}
                                />
                            </Field>
                            <div className="h-[60vh] overflow-y-auto mt-4">
                                {courseTimetable.filter((classData: any) => classData.classNo.toLowerCase().includes(classSearchQuery.toLowerCase())).map((classData: any) => (
                                    <button key={classData.classNo} className="p-4 w-full text-left border-b hover:bg-muted cursor-pointer" onClick={() => { handleAddClass(classData) }}>
                                        <div className="font-sans font-medium flex flex-row justify-evenly">
                                            <p>{classData.classNo}</p>
                                            <p>{classData.startTime} - {classData.endTime}</p>
                                            <p>{classData.venue} </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
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
            </main >

            <aside className={`shrink-0 border-l overflow-hidden transition-all duration-300 ${isPanelOpen ? "w-[20rem]" : "w-0"}`}>
                {currentFolder && (
                    <div className="flex flex-col h-full p-4">
                        <div>
                            <h2 className="font-heading text-xl font-bold mb-4">{currentFolder.name}</h2>
                            <p className="font-sans text-muted-foreground">{currentFolder.description}</p>
                        </div>
                        <div className="mt-6 flex flex-col">
                            <p className="font-sans text-md font-semibold">Links</p>
                            <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                            <div className="mt-4 flex flex-row gap-2">
                                <Button onClick={() => { setIsGeneralDialogOpen(false); setIsNewLinkDialogOpen(true) }} className='p-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="h-50 overflow-y-auto mt-4 flex flex-col gap-3">
                                {
                                    currentFolderLinks.map((link) => (
                                        <a key={link.linkId} href={link.url} target="_blank" className="font-sans hover:underline">
                                            {link.title}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </div >
    );
}