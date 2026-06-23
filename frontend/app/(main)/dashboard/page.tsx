"use client";

// React Hooks
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// UI Components
import { toast } from "sonner";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import CourseGrid from "@/components/course/CourseGrid";
import EditCourseDialog from "@/components/course/EditCourseDialog";
import DeleteCourseDialog from "@/components/course/DeleteCourseDialog";
import AddNUSCourseDialog from "@/components/course/AddNUSCourseDialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";

// API Calls
import { addFolder } from "@/lib/api/folder";
import { getAllCourses, getAllNUSCourses, addCourse, deleteCourse } from "@/lib/api/course";

// Utils
import { Button } from "@/components/ui/button";
import { modeStyle, switchMode } from "@/lib/utils/mode";
import { generateDefaultFolders } from "@/lib/utils/folder";

export default function DashboardPage() {
    const { data: session } = useSession();

    // UI states
    const [addNUSCourseDialogOpen, setAddNUSCourseDialogOpen] = useState(false);
    const [gridMode, setGridMode] = useState<"NORMAL" | "EDIT" | "DELETE">("NORMAL");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Data states
    const [nusCourses, setNUSCourses] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

    // Handlers
    const handleOpenAddNUSCourseDialog = async () => {
        try {
            const courses = await getAllNUSCourses();
            setNUSCourses(courses);
            setAddNUSCourseDialogOpen(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch courses. Please try again later.");
        }
    }

    const handleAddNUSCourse = (course: any) => {
        setAddNUSCourseDialogOpen(false);
        toast.promise(
            (async () => {
                const newCourse = await addCourse(session?.user?.id || "", course.moduleCode, course.title, "NUS");
                const defaultFolders = generateDefaultFolders(course.moduleCode);
                for (const folder of defaultFolders) await addFolder(newCourse.courseId, folder.folderName, folder.folderDescription);
            })(),
            {
                loading: `Adding ${course.moduleCode}...`,
                success: `${course.moduleCode} added successfully!`,
                error: (err) => err.message
            }
        );
    }

    const handleDeleteCourse = async () => {
        toast.promise(
            (async () => {
                await deleteCourse(selectedCourse?.courseId || "");
            })(),
            {
                loading: `Deleting ${selectedCourse?.moduleCode}...`,
                success: `${selectedCourse?.moduleCode} deleted successfully!`,
                error: (err) => err.message
            }
        );
    }


    const handleFetchCourses = async () => {
        try {
            const courses = await getAllCourses(session?.user?.id || "");
            setCourses(courses);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch courses");
        }
    }

    const onPageLoad = async () => {
        if (!session?.user?.id)
            return;
        handleFetchCourses();
        toast.success("Welcome back " + session?.user?.name + "!");
    }

    useEffect(() => {
        onPageLoad();
    }, [session?.user?.id]);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6">
            <div className="font-heading text-4xl font-bold">Dashboard</div>
            <div className='font-sans mt-15 flex flex-row items-center gap-4'>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center justify-center font-sans px-2 py-1 rounded-md border hover:bg-primary hover:text-white shadow-sm transition-colors">
                        <Plus className="w-4 h-4 mr-1" />
                        Course
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="font-sans mt-1" onClick={handleOpenAddNUSCourseDialog}>
                            NUS Course
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-sans mt-2 mb-1">Custom Course</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => setGridMode(switchMode(gridMode, "EDIT"))} className={`flex items-center justify-center font-sans p-2 rounded-md ${modeStyle(gridMode, "EDIT")} border shadow-sm transition-colors`}>
                    <SquarePen className="w-4 h-4" />
                </Button>

                <Button onClick={() => setGridMode(switchMode(gridMode, "DELETE"))} className={`flex items-center justify-center font-sans p-2 rounded-md ${modeStyle(gridMode, "DELETE")} border shadow-sm transition-colors`}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <p className='text-sm text-muted-foreground italic'>
                {gridMode === "EDIT" && "You are in Edit mode. Click on a course to edit its details."}
                {gridMode === "DELETE" && "You are in Delete mode. Click on a course to delete it."}
            </p>

            <CourseGrid
                courses={courses}
                mode={gridMode}
                onCourseClick={setSelectedCourse}
                onEditModeCardClick={() => setEditDialogOpen(true)}
                onDeleteModeCardClick={() => setDeleteDialogOpen(true)}
            />


            <AddNUSCourseDialog
                open={addNUSCourseDialogOpen}
                onOpenChange={setAddNUSCourseDialogOpen}
                nusCourses={nusCourses}
                onCourseClick={handleAddNUSCourse}
            />

            <EditCourseDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />

            <DeleteCourseDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                course={selectedCourse}
                onDeleteCourse={handleDeleteCourse}
            />

        </div>
    );
}