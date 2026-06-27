"use client";

// React hooks
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// UI Components
import { toast } from "sonner";
import TaskList from "@/components/task/TaskList";

// API calls
import { createTask, toggleTaskCompletion, updateTaskName, deleteTask } from "@/lib/api/task";
import { getAllCoursesWithTasks } from "@/lib/api/course";

export default function TaskPage() {
    const { data: session } = useSession();

    const [courseTasks, setCourseTasks] = useState<any[]>([]);

    const getAllCourses = async () => {
        try {
            const courses = await getAllCoursesWithTasks(session?.user?.id || "");
            setCourseTasks(courses);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch tasks. Please try again later.");
        }
    }

    const addNewTask = async (taskType: "WEEKLY" | "TODAY", taskName: string, courseId?: string) => {
        try {
            const newTask = await createTask(session?.user.id || "", taskName, taskType, courseId || "");
            setCourseTasks(courseTasks.map((course) => (course.courseId === courseId) ? { ...course, tasks: [...course.tasks, newTask] } : course));
        } catch (error: any) {
            toast.error(error.message || "Failed to create task. Please try again later.");
        }
    }

    const toggleTask = async (taskId: string, courseId?: string) => {
        try {
            setCourseTasks(courseTasks.map((course) => (course.courseId === courseId) ? {
                ...course,
                tasks: course.tasks.map((task: any) => (task.taskId === taskId) ? { ...task, completed: !task.completed } : task)
            } : course));
            await toggleTaskCompletion(taskId);
        } catch (error) {
            toast.error("Failed to update task completion status. Please try again later.");
        }
    }


    const handleUpdateTask = async (taskId: string, newName: string, courseId?: string) => {
        try {
            await updateTaskName(taskId, newName);
            setCourseTasks(courseTasks.map((course) => (course.courseId === courseId) ? {
                ...course,
                tasks: course.tasks.map((task: any) => (task.taskId === taskId) ? { ...task, name: newName } : task)
            } : course));
        } catch (error) {
            toast.error("Failed to update task name. Please try again later.");
        }
    }

    const handleDeleteTask = async (taskId: string, courseId?: string) => {
        try {
            setCourseTasks(courseTasks.map((course) => (course.courseId === courseId) ? {
                ...course,
                tasks: course.tasks.filter((task: any) => task.taskId !== taskId)
            } : course));
            await deleteTask(taskId);
        } catch (error) {
            toast.error("Failed to delete task. Please try again later.");
        }
    }

    const onPageStart = async () => {
        if (session?.user?.id) {
            await getAllCourses();
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
                            </div>
                            <TaskList
                                tasks={course?.tasks?.filter((task: any) => task.taskType === "TODAY")}
                                type="TODAY"
                                onAdd={(type, name) => addNewTask(type, name, course.courseId)}
                                onToggle={(taskId) => toggleTask(taskId, course.courseId)}
                                onUpdate={(taskId, newName) => handleUpdateTask(taskId, newName, course.courseId)}
                                onDelete={(taskId) => handleDeleteTask(taskId, course.courseId)}
                            />
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
                            </div>
                            <TaskList
                                tasks={course?.tasks?.filter((task: any) => task.taskType === "WEEKLY")}
                                type="WEEKLY"
                                onAdd={(type, name) => addNewTask(type, name, course.courseId)}
                                onToggle={(taskId) => toggleTask(taskId, course.courseId)}
                                onUpdate={(taskId, newName) => handleUpdateTask(taskId, newName, course.courseId)}
                                onDelete={(taskId) => handleDeleteTask(taskId, course.courseId)}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}