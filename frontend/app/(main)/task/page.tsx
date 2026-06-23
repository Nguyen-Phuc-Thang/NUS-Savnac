"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CourseCard from "@/components/course/CourseCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function TaskPage() {
    const { data: session } = useSession();


    const [tasks, setTasks] = useState<any[]>([]);
    const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
    const [todayTasks, setTodayTasks] = useState<any[]>([]);

    const [courseTasks, setCourseTasks] = useState<any[]>([]);
    const [taskCompleteStatus, setTaskCompleteStatus] = useState<{ [key: string]: boolean }>({});

    const [taskNameInput, setTaskNameInput] = useState<string>("");
    const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState<boolean>(false);
    const [targetCourse, setTargetCourse] = useState<any>(null);

    const saveTaskStatus = async (tasks: any[]) => {
        for (const task of tasks) {
            taskCompleteStatus[task.taskId] = task.completed;
        }
    }

    const getAllTasks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/get-all-tasks-by-user?userId=${session?.user?.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            setTasks(response);
            await saveTaskStatus(response);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    const getAllCoursesWithTasks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/all-courses-with-tasks?userId=${session?.user?.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            setCourseTasks(response);
        }
        catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    }

    const addNewTask = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/create-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: targetCourse?.userId,
                    name: taskNameInput,
                    taskType: targetCourse?.taskType,
                    courseId: targetCourse?.courseId,
                }),
            }).then((res) => res.json());

            await getAllCoursesWithTasks();
            setIsNewTaskDialogOpen(false);
            setTaskNameInput("");
        } catch (error) {
            console.error("Error adding new task:", error);
        }
    }

    const toggleTaskCompletion = (taskId: string) => {
        setTaskCompleteStatus((prevStatus) => ({
            ...prevStatus,
            [taskId]: !prevStatus[taskId],
        }));
        console.log("Toggling task completion for taskId:", taskId);
        try {
            const response = fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/toggle-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskId: taskId,
                }),
            }).then((res) => res.json());
            console.log("Task toggled:", response);
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    }

    const onPageStart = async () => {
        if (session?.user?.id) {
            await getAllTasks();
            await getAllCoursesWithTasks();
        }
    }

    useEffect(() => {
        onPageStart();
    }, [session?.user?.id]);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6">
            <div className="font-heading text-4xl font-bold">Tasks</div>


            <section className="flex flex-col mt-4">
                <div className="font-heading text-2xl font-bold">Today</div>
                <div className="h-[0.5px] w-full bg-gray-300 mt-2"></div>
                <div className="w-full mt-10 grid justify-start gap-x-8 gap-y-8 [grid-template-columns:repeat(auto-fill,minmax(20vw,20vw))]">
                    {courseTasks.map((course: any) => (
                        <div key={course.courseId} className="flex h-auto w-[20vw] flex-col">
                            <div className="flex flex-row items-center">
                                <p className="font-bold font-sans text-lg">{course.courseCode}</p>
                                <Button className='ml-2 rounded-md bg-white hover:bg-white text-black border shadow-sm transition-colors' onClick={() => {
                                    setIsNewTaskDialogOpen(true);
                                    setTargetCourse({
                                        courseId: course.courseId,
                                        userId: course.userId,
                                        taskType: 'TODAY',
                                    });
                                }}>
                                    <Plus />
                                </Button>
                            </div>
                            {course.tasks.filter((task: any) => task.taskType === 'TODAY').map((task: any) => {
                                return (
                                    <div key={task.taskId} className="flex flex-row items-center mt-2">
                                        <Checkbox className="mr-2" checked={taskCompleteStatus[task.taskId]} onCheckedChange={() => toggleTaskCompletion(task.taskId)} />
                                        <p>{task.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col mt-4">
                <div className="font-heading text-2xl font-bold">Weekly</div>
                <div className="h-[0.5px] w-full bg-gray-300 mt-2"></div>
                <div className="w-full mt-10 grid justify-start gap-x-8 gap-y-8 [grid-template-columns:repeat(auto-fill,minmax(20vw,20vw))]">
                    {courseTasks.map((course: any) => (
                        <div key={course.courseId} className="flex h-auto w-[20vw] flex-col">
                            <div className="flex flex-row items-center">
                                <p className="font-bold font-sans text-lg">{course.courseCode}</p>
                                <Button className='ml-2 rounded-md bg-white hover:bg-white text-black border shadow-sm transition-colors' onClick={() => {
                                    setIsNewTaskDialogOpen(true);
                                    setTargetCourse({
                                        courseId: course.courseId,
                                        userId: course.userId,
                                        taskType: 'WEEKLY',
                                    });
                                }}>
                                    <Plus />
                                </Button>
                            </div>
                            {course.tasks.filter((task: any) => task.taskType === 'WEEKLY').map((task: any) => {
                                return (
                                    <div key={task.taskId} className="flex flex-row items-center mt-2">
                                        <Checkbox className="mr-2" checked={taskCompleteStatus[task.taskId]} onCheckedChange={() => toggleTaskCompletion(task.taskId)} />
                                        <p>{task.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>

            <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Input
                            type="text"
                            placeholder="Enter task name"
                            className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                            value={taskNameInput}
                            onChange={(e) => setTaskNameInput(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={addNewTask} className='font-sans px-4 py-3 bg-secondary hover:bg-primary' type="submit">Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}