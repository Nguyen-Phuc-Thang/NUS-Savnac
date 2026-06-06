"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/course-card";

interface NUSCourse {
    moduleCode: string;
    title: string;
}

interface UserCourse {
    courseCode: string;
    courseTitle: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();

    const router = useRouter();

    // UI states
    const [AddNUSCourseDialogOpen, setAddNUSCourseDialogOpen] = useState(false);

    // Form states
    const [courseCodeQuery, setCourseCodeQuery] = useState("");

    // Data states
    const [courses, setCourses] = useState<UserCourse[]>([]);
    const [nusCourses, setNUSCourses] = useState<NUSCourse[]>([]);

    // Handlers
    const handleAddNUSCourseDialogOpen = async () => {
        try {
            const courses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/all-nus-courses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            setNUSCourses(courses);
            setAddNUSCourseDialogOpen(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch courses. Please try again later.");
        }
    }

    const handleAddNUSCourse = (course: NUSCourse) => {
        setAddNUSCourseDialogOpen(false);
        toast.promise(
            (async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/course/add-nus-course`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: session?.user?.id,
                            courseCode: course.moduleCode,
                        }),
                    }
                );

                const data = await response.json();

                const foldersToCreate = [
                    {
                        folderName: "Lecture",
                        folderDescription: `${course.moduleCode} lecture folder`,
                    },
                    {
                        folderName: "Tutorial",
                        folderDescription: `${course.moduleCode} tutorial folder`,
                    },
                    {
                        folderName: "Lab",
                        folderDescription: `${course.moduleCode} lab folder`,
                    }, {
                        folderName: "__general__",
                        folderDescription: `${course.moduleCode} general folder`,
                    }
                ]

                for (const folder of foldersToCreate) {
                    console.log("Creating folder: ", folder);
                    const folderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/create-folder`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            courseId: data.courseId,
                            ...folder
                        }),
                    });

                    if (!folderResponse.ok) break;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Failed to add course");
                }

                if (response.ok) {
                    getAllCourses();
                }
            })(),
            {
                loading: `Adding ${course.moduleCode}...`,
                success: `${course.moduleCode} added successfully!`,
                error: (err) => err.message
            }
        );
    }

    const getAllCourses = async () => {
        try {
            const courses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/user-courses?userId=${session?.user?.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            setCourses(courses);

        } catch (error: any) {
            toast.error(error.message || "Failed to fetch courses. Please try again later.");
        }
    }

    useEffect(() => {
        getAllCourses();
        toast.success("Welcome back " + session?.user?.name + "!");
    }, [session?.user?.id]);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6">
            <div className="font-heading text-4xl font-bold">Dashboard</div>
            <div className='font-sans mt-15'>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center justify-center font-sans px-4 py-2 rounded-md border hover:bg-primary hover:text-white shadow-sm transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Add new course
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="font-sans mt-1" onClick={handleAddNUSCourseDialogOpen}>
                            NUS Course
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-sans mt-2 mb-1">Custom Course</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="w-full mt-10 grid grid-cols-[repeat(auto-fill,minmax(15rem,15rem))] justify-start gap-x-8 gap-y-8">
                {courses.map((course) => (
                    <CourseCard
                        key={course.courseCode}
                        courseCode={course.courseCode}
                        title={course.courseTitle}
                        onClick={() => router.push(`/dashboard/courses/${course.courseCode}`)}
                    />
                ))}
            </div>


            <Dialog open={AddNUSCourseDialogOpen} onOpenChange={setAddNUSCourseDialogOpen}>
                <DialogContent className="w-[50vw] max-w-none">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-2xl">Add NUS Course</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Field className="w-full">
                            <Input
                                type="text"
                                placeholder="Search by course code (e.g. CS1010)"
                                className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                value={courseCodeQuery}
                                onChange={(e) => setCourseCodeQuery(e.target.value)}
                            />
                        </Field>
                        <div className="h-[60vh] overflow-y-auto mt-4">
                            {nusCourses.filter((course) => course.moduleCode.toLowerCase().includes(courseCodeQuery.toLowerCase())).map((course) => (
                                <button key={course.moduleCode} className="p-4 w-full text-left border-b hover:bg-muted cursor-pointer" onClick={() => handleAddNUSCourse(course)}>
                                    <div className="font-sans font-medium">{course.moduleCode} {course.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}