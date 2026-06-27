import {
    CircularProgressbar,
    buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import { taskCompletionProgress } from "@/lib/utils/task";

interface CourseCardProps {
    courseCode: string;
    title: string;
    tasks: any[],
    onClick?: () => void;
}

export default function CourseCard({ courseCode, title, tasks, onClick }: CourseCardProps) {
    const { ratio, text } = taskCompletionProgress(tasks);

    return (
        <button className={`w-60 border rounded-md p-4 flex flex-col justify-between shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-secondary hover:ring hover:ring-secondary`} onClick={onClick}>
            <div className="flex items-center justify-center">
                <div className="w-40 h-40">
                    <CircularProgressbar
                        value={ratio * 100}
                        text={text}
                        styles={buildStyles({
                            pathColor: "#003062",
                            trailColor: "#e5e7eb",
                            textColor: "#111827",
                            textSize: "16px",
                        })}
                    />
                </div>
            </div>
            <div className="mt-7">
                <p className="font-sans font-medium text-md">{courseCode}</p>
            </div>
            <div className="h-15 mt-2">
                <p className="font-sans text-sm text-muted-foreground">{title}</p>
            </div>
        </button>
    );
}