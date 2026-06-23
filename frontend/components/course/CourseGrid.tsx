"use client";

// React Hooks
import { useRouter } from "next/navigation";

// Components
import CourseCard from "@/components/course/CourseCard";

interface CourseGridProps {
    courses: any[];
    mode: "NORMAL" | "EDIT" | "DELETE";
    onCourseClick?: (course: any) => void;
    onEditModeCardClick?: () => void;
    onDeleteModeCardClick?: () => void;
}

export default function CourseGrid({ courses, mode, onCourseClick, onEditModeCardClick, onDeleteModeCardClick }: CourseGridProps) {

    const router = useRouter();

    const handleCardClick = (course: any) => {
        onCourseClick?.(course);
        if (mode === "EDIT") onEditModeCardClick?.();
        else if (mode === "DELETE") onDeleteModeCardClick?.();
        else router.push(`/dashboard/courses/${course.courseCode}`);
    }

    return (
        <div>
            <div className="w-full mt-3 grid grid-cols-[repeat(auto-fill,minmax(15rem,15rem))] justify-start gap-x-8 gap-y-8">
                {courses.map((course) => (
                    <CourseCard
                        key={course.courseCode}
                        courseCode={course.courseCode}
                        title={course.courseTitle}
                        onClick={() => handleCardClick(course)}
                    />
                ))}
            </div>
        </div>
    )
}