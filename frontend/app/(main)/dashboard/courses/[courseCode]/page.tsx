"use client";

// React hooks
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// UI Components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Folder, Plus, Link, CalendarDays, Minus, SquarePen, Trash2 } from "lucide-react";
import AddFolderDialog from "@/components/folder/AddFolderDialog";
import AddLinkDialog from "@/components/link/AddLinkDialog";
import AddEventDialog from "@/components/event/AddEventDialog";
import FolderPanel from "@/components/folder/FolderPanel";
import AddClassDialog from "@/components/event/AddClassDialog";
import FolderGrid from "@/components/folder/FolderGrid";
import EditFolderDialog from "@/components/folder/EditFolderDialog";
import DeleteFolderDialog from "@/components/folder/DeleteFolderDialog";
import LinkGrid from "@/components/link/LinkGrid";
import EditLinkDialog from "@/components/link/EditLinkDialog";
import DeleteLinkDialog from "@/components/link/DeleteLinkDialog";
import ScheduleCalendar from "@/components/event/ScheduleCalendar";
import EventInfoDialog from "@/components/event/EventInfoDialog";
import EditEventDialog from "@/components/event/EditEventDialog";
import DeleteEventDialog from "@/components/event/DeleteEventDialog";
import TaskList from "@/components/task/TaskList";

// API Calls
import { getNUSCourseData, getCourseInfo } from "@/lib/api/course";
import { createLink, updateLink, deleteLink } from "@/lib/api/link";
import { getFolders, addFolder, updateFolder, deleteFolder } from "@/lib/api/folder";
import { getEventsByCourseId, addEvent, updateEvent, deleteEvent } from "@/lib/api/event";
import { getTasksByCourseId, createTask, toggleTaskCompletion, updateTaskName, deleteTask } from "@/lib/api/task";

// Utils
import { restructureClasses } from "@/lib/utils/scheduleManipulation";
import { modeStyle, switchMode } from "@/lib/utils/mode";
import { generateWorkload } from "@/lib/utils/course";
import { formatToDatabase, formatToMonthDayYear } from "@/lib/utils/format";



export default function CoursePage() {
    const params = useParams();
    const { data: session } = useSession();

    // UI states
    const [addFolderDialogOpen, setAddFolderDialogOpen] = useState(false);
    const [editFolderDialogOpen, setEditFolderDialogOpen] = useState(false);
    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
    const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
    const [editLinkDialogOpen, setEditLinkDialogOpen] = useState(false);
    const [deleteLinkDialogOpen, setDeleteLinkDialogOpen] = useState(false);

    const [addClassDialogOpen, setAddClassDialogOpen] = useState(false);
    const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
    const [eventInfoDialogOpen, setEventInfoDialogOpen] = useState(false);
    const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
    const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);

    const [folderNameInput, setFolderNameInput] = useState("");
    const [folderDescriptionInput, setFolderDescriptionInput] = useState("");
    const [folderGridMode, setFolderGridMode] = useState<"NORMAL" | "EDIT" | "DELETE">("NORMAL");

    const [linkTitleInput, setLinkTitleInput] = useState("");
    const [linkUrlInput, setLinkUrlInput] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [linkGridMode, setLinkGridMode] = useState<"NORMAL" | "EDIT" | "DELETE">('NORMAL')

    const [eventTitleInput, setEventTitleInput] = useState("");
    const [eventTypeInput, setEventTypeInput] = useState<"CLASS" | "DEADLINE" | "EXAM" | "OTHERS">("CLASS");
    const [eventWeekInput, setEventWeekInput] = useState("");
    const [eventDayInput, setEventDayInput] = useState("");
    const [eventStartTimeHourInput, setEventStartTimeHourInput] = useState("");
    const [eventStartTimeMinuteInput, setEventStartTimeMinuteInput] = useState("");
    const [eventEndTimeHourInput, setEventEndTimeHourInput] = useState("");
    const [eventEndTimeMinuteInput, setEventEndTimeMinuteInput] = useState("");
    const [eventVenueInput, setEventVenueInput] = useState("");

    // Data states
    const [courseData, setCourseData] = useState<any>(null);
    const [workloadComponents, setWorkloadComponents] = useState<any>([]);
    const workloadBarLength = 500; // in pixels

    const getCourseData = async () => {
        try {
            const dataFromNUS = await getNUSCourseData(String(params.courseCode));
            const dataFromDatabase = await getCourseInfo(String(params.courseCode), session?.user?.id || "");
            const fullCourseData = { courseId: dataFromDatabase?.courseId, ...dataFromNUS };
            setCourseData(fullCourseData);
            setWorkloadComponents(generateWorkload(dataFromNUS));
            setCourseTimetable(restructureClasses(dataFromNUS.semesterData[1]));
            return fullCourseData;
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch course data. Please try again later.");
        }
    }

    // Folder states and handlers
    const [folders, setFolders] = useState<any[]>([]);
    const [generalFolder, setGeneralFolder] = useState<any>(null);
    const [selectedFolder, setSelectedFolder] = useState<any>(null);

    const getAllFolders = async (courseId: string) => {
        try {
            const folders = await getFolders(courseId);
            setFolders(folders.filter((folder: any) => folder.name !== '__general__'));
            setGeneralFolder(folders.find((folder: any) => folder.name === '__general__'));
            setSelectedFolder(folders.find((folder: any) => folder.name === '__general__'));
            return folders;
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch folders. Please try again later.");
        }
    }

    const handleCreateFolder = async () => {
        try {
            const newFolder = await addFolder(courseData.courseId, folderNameInput, folderDescriptionInput);
            toast.success("Folder " + folderNameInput + " created successfully!");
            setFolders([...folders, newFolder]);
        } catch (error: any) {
            toast.error(error.message || "Failed to create folder. Please try again later.");
        } finally {
            setAddFolderDialogOpen(false);
        }
    }

    const handleUpdateFolder = async () => {
        try {
            await updateFolder(selectedFolder.folderId, folderNameInput, folderDescriptionInput);
            toast.success("Folder " + folderNameInput + " updated successfully!");
            setFolders(folders.map((folder) => folder.folderId === selectedFolder.folderId ? { ...folder, name: folderNameInput, description: folderDescriptionInput } : folder));
        } catch (error: any) {
            toast.error(error.message || "Failed to update folder. Please try again later.");
        } finally {
            setEditFolderDialogOpen(false);
        }
    }

    const handleDeleteFolder = async () => {
        try {
            await deleteFolder(selectedFolder.folderId);
            setFolders(folders.filter((folder) => folder.folderId !== selectedFolder.folderId));
            toast.success("Folder " + selectedFolder.name + " deleted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete folder. Please try again later.");
        } finally {
            setDeleteFolderDialogOpen(false);
        }
    }

    const handleFolderClick = async (folder: any) => {
        if (folder.folderId === selectedFolder?.folderId) {
            setSelectedFolder(generalFolder);
            setIsPanelOpen(false);
        } else {
            setSelectedFolder(folder);
            setIsPanelOpen(true);
        }
    }


    // Link handlers
    const [selectedLink, setSelectedLink] = useState<any>(null);
    const handleCreateLink = async () => {
        try {
            const newLink = await createLink(selectedFolder?.folderId || "", linkTitleInput, linkUrlInput);
            toast.success("Link " + linkTitleInput + " created successfully!");
            setAddLinkDialogOpen(false);
            selectedFolder.links.push(newLink);
            setSelectedFolder({ ...selectedFolder });
        } catch (error: any) {
            toast.error(error.message || "Failed to create link. Please try again later.");
        }
    }

    const handleUpdateLink = async () => {
        try {
            await updateLink(selectedLink.linkId, linkTitleInput, linkUrlInput);
            toast.success("Link " + linkTitleInput + " updated successfully!");
            const newFolder = { ...selectedFolder, links: selectedFolder.links.map((link: any) => link.linkId === selectedLink.linkId ? { ...link, title: linkTitleInput, url: linkUrlInput } : link) };
            setSelectedFolder(newFolder);
            if (selectedFolder.folderId === generalFolder.folderId) setGeneralFolder(newFolder);

        } catch (error: any) {
            toast.error(error.message || "Failed to update link. Please try again later.");
        } finally {
            setEditLinkDialogOpen(false);
        }
    }

    const handleDeleteLink = async () => {
        try {
            await deleteLink(selectedLink.linkId);
            toast.success("Link " + selectedLink.title + " deleted successfully!");
            const newFolder = { ...selectedFolder, links: selectedFolder.links.filter((link: any) => link.linkId !== selectedLink.linkId) };
            setSelectedFolder(newFolder);
            if (selectedFolder.folderId === generalFolder.folderId) setGeneralFolder(newFolder);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete link. Please try again later.");
        } finally {
            setDeleteLinkDialogOpen(false);
        }
    }

    // Schedule handlers

    const [events, setEvents] = useState<any[]>([]);
    const [courseTimetable, setCourseTimetable] = useState<any>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const getAllEvents = async (courseId: string) => {
        try {
            const events = await getEventsByCourseId(courseId);
            setEvents(events);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch events. Please try again later.");
        }
    }

    const handleAddClass = async (classData: any) => {
        console.log(classData);
        try {
            for (const week of classData.weeks) {
                const newEvent = await addEvent(
                    session?.user?.id || "",
                    "CLASS",
                    classData.classNo,
                    "Week " + week.toString(),
                    classData.day,
                    classData.startTime,
                    classData.endTime,
                    classData.venue,
                    courseData.courseId
                );
                setEvents((prevEvents) => [...prevEvents, newEvent]);
            }
            toast.success("Class " + classData.classNo + " added successfully!");
        } catch (error) {
            toast.error("Failed to add class. Please try again later.");
        } finally {
            setAddClassDialogOpen(false);
        }
    }

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
                courseData.courseId
            );

            toast.success("Event " + eventTitleInput + " created successfully!");
            setEvents([...events, newEvent]);
        } catch (error: any) {
            toast.error(error.message || "Failed to create event. Please try again later.");
        } finally {
            setAddEventDialogOpen(false);
        }
    }

    const handleEventClick = (info: any) => {
        setSelectedEvent({
            title: info.event.title,
            eventType: info.event.extendedProps.eventType,
            course: info.event.extendedProps.course,
            venue: info.event.extendedProps.venue,
            week: info.event.extendedProps.week,
            day: info.event.extendedProps.day,
            startTime: info.event.extendedProps.startTime.slice(0, 2) + ":" + info.event.extendedProps.startTime.slice(2, 4),
            endTime: info.event.extendedProps.endTime.slice(0, 2) + ":" + info.event.extendedProps.endTime.slice(2, 4),
            eventId: info.event.extendedProps.eventId
        });
        setEventInfoDialogOpen(true);
    }

    const handleUpdateEvent = async () => {
        try {
            await updateEvent(
                selectedEvent.eventId,
                eventTypeInput,
                eventTitleInput,
                eventWeekInput,
                eventDayInput,
                formatToDatabase(eventStartTimeHourInput, eventStartTimeMinuteInput),
                formatToDatabase(eventEndTimeHourInput, eventEndTimeMinuteInput),
                eventVenueInput
            );
            toast.success("Event " + eventTitleInput + " updated successfully!");
            setEvents(events.map((event) => event.eventId === selectedEvent.eventId ? {
                ...event,
                eventType: eventTypeInput,
                title: eventTitleInput,
                week: eventWeekInput,
                day: eventDayInput,
                startTime: formatToDatabase(eventStartTimeHourInput, eventStartTimeMinuteInput),
                endTime: formatToDatabase(eventEndTimeHourInput, eventEndTimeMinuteInput),
                venue: eventVenueInput
            } : event));
        } catch (error: any) {
            toast.error(error.message || "Failed to update event. Please try again later.");
        } finally {
            setEventInfoDialogOpen(false);
            setEditEventDialogOpen(false);
        }
    }

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(selectedEvent.eventId);
            toast.success("Event " + selectedEvent.title + " deleted successfully!");
            setEvents(events.filter((event) => event.eventId !== selectedEvent.eventId));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event. Please try again later.");
        } finally {
            setEventInfoDialogOpen(false);
            setDeleteEventDialogOpen(false);
        }
    }

    // Tasks states and handlers
    const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
    const [todayTasks, setTodayTasks] = useState<any[]>([]);

    const getAllTasks = async (courseId: string) => {
        try {
            const tasks = await getTasksByCourseId(courseId);
            setWeeklyTasks(tasks.filter((task: any) => task.taskType === "WEEKLY"));
            setTodayTasks(tasks.filter((task: any) => task.taskType === "TODAY"));
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch tasks. Please try again later.");
        }
    }

    const addNewTask = async (taskType: "WEEKLY" | "TODAY", taskName: string) => {
        try {
            const newTask = await createTask(session?.user.id || "", taskName, taskType, courseData.courseId);
            if (taskType === "WEEKLY") {
                setWeeklyTasks([...weeklyTasks, newTask]);
            } else {
                setTodayTasks([...todayTasks, newTask]);
            }
            toast.success("Task " + taskName + " created successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to create task. Please try again later.");
        }
    }

    const toggleTask = async (taskId: string) => {
        try {
            setWeeklyTasks(weeklyTasks.map((task) => task.taskId === taskId ? { ...task, completed: !task.completed } : task));
            setTodayTasks(todayTasks.map((task) => task.taskId === taskId ? { ...task, completed: !task.completed } : task));
            await toggleTaskCompletion(taskId);
        } catch (error) {
            toast.error("Failed to update task completion status. Please try again later.");
        }
    }


    const handleUpdateTask = async (taskId: string, newName: string) => {
        try {
            await updateTaskName(taskId, newName);
            setTodayTasks(todayTasks.map((task) => task.taskId === taskId ? { ...task, name: newName } : task));
            setWeeklyTasks(weeklyTasks.map((task) => task.taskId === taskId ? { ...task, name: newName } : task));
        } catch (error) {
            toast.error("Failed to update task name. Please try again later.");
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
            setTodayTasks(todayTasks.filter((task) => task.taskId !== taskId));
            setWeeklyTasks(weeklyTasks.filter((task) => task.taskId !== taskId));
            await deleteTask(taskId);
        } catch (error) {
            toast.error("Failed to delete task. Please try again later.");
        }
    }

    const fetchData = async () => {
        if (params.courseCode) {
            const courseData = await getCourseData();
            await getAllFolders(courseData.courseId);
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
                            <div className="mt-2 font-sans text-muted-foreground">
                                <p>Exam Date: {formatToMonthDayYear(courseData?.semesterData[1].examDate)}</p>
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
                        </section>
                    </div>
                    <div className='w-[1px] h-full bg-gray-300 ml-10'></div>
                    <div className='flex flex-col ml-4 w-1/4'>
                        <p className='font-heading'>Weekly Tasks</p>
                        <TaskList
                            tasks={weeklyTasks}
                            type="WEEKLY"
                            onToggle={toggleTask}
                            onAdd={addNewTask}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                        />
                    </div>
                    <div className='w-[1px] h-full bg-gray-300 ml-3'></div>
                    <div className='flex flex-col ml-4 w-1/4'>
                        <p className='font-heading'>Today Tasks</p>
                        <TaskList
                            tasks={todayTasks}
                            type="TODAY"
                            onToggle={toggleTask}
                            onAdd={addNewTask}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                        />
                    </div>
                </div >

                <section>
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <Folder className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Folders</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                    <div className='mt-4 flex flex-row items-center gap-4'>
                        <Button onClick={() => setAddFolderDialogOpen(true)} className='font-sans px-2 py-1 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                            <Plus className="w-4 h-4" /> Folder
                        </Button>
                        <Button onClick={() => setFolderGridMode(switchMode(folderGridMode, "EDIT"))} className={`flex items-center justify-center font-sans p-2 rounded-md ${modeStyle(folderGridMode, "EDIT")} border shadow-sm transition-colors`}>
                            <SquarePen className="w-4 h-4" />
                        </Button>

                        <Button onClick={() => setFolderGridMode(switchMode(folderGridMode, "DELETE"))} className={`flex items-center justify-center font-sans p-2 rounded-md ${modeStyle(folderGridMode, "DELETE")} border shadow-sm transition-colors`}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <FolderGrid
                        folders={folders}
                        mode={folderGridMode}
                        selectedFolder={selectedFolder}
                        setSelectedFolder={setSelectedFolder}
                        onFolderClick={handleFolderClick}
                        onEditModeFolderClick={() => setEditFolderDialogOpen(true)}
                        onDeleteModeFolderClick={() => setDeleteFolderDialogOpen(true)}
                    />
                </section>

                <section className="mt-10">
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <Link className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Links</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                    <div className='mt-4 flex flex-row items-center gap-4'>
                        <Button onClick={() => setAddLinkDialogOpen(true)} className='font-sans px-2 py-1 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                            <Plus className="w-4 h-4" /> Link
                        </Button>
                        <Button onClick={() => setLinkGridMode(switchMode(linkGridMode, 'EDIT'))} className={`flex items-center justify-center font-sans p-2 rounded-md ${modeStyle(linkGridMode, 'EDIT')} border shadow-sm transition-colors`}>
                            <SquarePen className="w-4 h-4" />
                        </Button>

                        <Button onClick={() => setLinkGridMode(switchMode(linkGridMode, 'DELETE'))} className={`flex items-center justify-center font-sans p-2 rounded-md ${modeStyle(linkGridMode, 'DELETE')} border shadow-sm transition-colors`}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <LinkGrid
                        mode={linkGridMode}
                        onLinkClick={(link) => setSelectedLink(link)}
                        onEditModeLinkClick={() => setEditLinkDialogOpen(true)}
                        onDeleteModeLinkClick={() => setDeleteLinkDialogOpen(true)}
                        folder={generalFolder}
                    />

                </section>

                <section className="mt-10">
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <CalendarDays className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Schedule</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>


                    <ScheduleCalendar
                        events={events}
                        onEventClick={handleEventClick}
                        onAddClassClick={() => setAddClassDialogOpen(true)}
                        onAddEventClick={() => setAddEventDialogOpen(true)}
                    />
                </section>


                <AddFolderDialog
                    open={addFolderDialogOpen}
                    onOpenChange={setAddFolderDialogOpen}
                    folderNameInput={folderNameInput}
                    setFolderNameInput={setFolderNameInput}
                    folderDescriptionInput={folderDescriptionInput}
                    setFolderDescriptionInput={setFolderDescriptionInput}
                    onCreate={handleCreateFolder}
                />

                <EditFolderDialog
                    open={editFolderDialogOpen}
                    onOpenChange={setEditFolderDialogOpen}
                    folder={selectedFolder}
                    folderNameInput={folderNameInput}
                    setFolderNameInput={setFolderNameInput}
                    folderDescriptionInput={folderDescriptionInput}
                    setFolderDescriptionInput={setFolderDescriptionInput}
                    onUpdate={handleUpdateFolder}
                />

                <DeleteFolderDialog
                    open={deleteFolderDialogOpen}
                    onOpenChange={setDeleteFolderDialogOpen}
                    folder={selectedFolder}
                    onDelete={handleDeleteFolder}
                />

                <AddLinkDialog
                    open={addLinkDialogOpen}
                    onOpenChange={setAddLinkDialogOpen}
                    linkTitleInput={linkTitleInput}
                    setLinkTitleInput={setLinkTitleInput}
                    linkUrlInput={linkUrlInput}
                    setLinkUrlInput={setLinkUrlInput}
                    onCreate={handleCreateLink}
                />

                <EditLinkDialog
                    open={editLinkDialogOpen}
                    onOpenChange={setEditLinkDialogOpen}
                    link={selectedLink}
                    linkTitleInput={linkTitleInput}
                    setLinkTitleInput={setLinkTitleInput}
                    linkUrlInput={linkUrlInput}
                    setLinkUrlInput={setLinkUrlInput}
                    onUpdate={handleUpdateLink}
                />

                <DeleteLinkDialog
                    open={deleteLinkDialogOpen}
                    onOpenChange={setDeleteLinkDialogOpen}
                    link={selectedLink}
                    onDelete={handleDeleteLink}
                />

                <AddClassDialog
                    open={addClassDialogOpen}
                    onOpenChange={setAddClassDialogOpen}
                    timetable={courseTimetable}
                    onCreate={handleAddClass}
                />

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
                    onEditEventClick={() => selectedEvent.eventType === "CLASS" ? toast.warning("Classes are non-editable") : setEditEventDialogOpen(true)}
                    onDeleteEventClick={() => setDeleteEventDialogOpen(true)}
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

            </main >

            <FolderPanel
                open={isPanelOpen}
                folder={selectedFolder}
                onLinkClick={setSelectedLink}
                onAdd={() => setAddLinkDialogOpen(true)}
                onEdit={() => setEditLinkDialogOpen(true)}
                onDelete={() => setDeleteLinkDialogOpen(true)}
            />
        </div >
    );
}