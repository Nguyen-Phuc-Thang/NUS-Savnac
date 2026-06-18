
interface CourseCardProps {
    courseCode: string;
    title: string;
    onClick?: () => void;
}

export default function CourseCard({ courseCode, title, onClick }: CourseCardProps) {
    return (
        <button className="w-60 border rounded-md p-4 flex flex-col justify-between shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-secondary hover:ring hover:ring-secondary" onClick={onClick}>
            <div className="w-full h-50"></div>
            <div className="mt-2">
                <p className="font-sans font-medium text-md">{courseCode}</p>
            </div>
            <div className="h-15 mt-2">
                <p className="font-sans text-sm text-muted-foreground">{title}</p>
            </div>
        </button>
    );
}