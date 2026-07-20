import { Skeleton } from '@/components/ui/skeleton';

export default function TimerSkeleton() {
    return (
        <div className="max-w-md bg-white shadow-xl w-full p-8 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex justify-center mb-6">
                <Skeleton className="h-11 w-52 rounded-xl" />
            </div>

            <div className="w-72 h-72 mx-auto mb-8">
                <Skeleton className="w-full h-full rounded-full" />
            </div>

            <div className="flex justify-center gap-4 mt-4 mb-4">
                <Skeleton className="h-12 w-32 rounded-md" />
                <Skeleton className="h-12 w-32 rounded-md" />
            </div>

            <div className="flex justify-center mb-4 py-2">
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
        </div>
    );
}
