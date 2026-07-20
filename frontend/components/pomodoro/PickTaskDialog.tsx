'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    incompleteTasks: any[];
    selectedTask: any | undefined;
    onSelectTask: (task: any | undefined) => void;
}

export default function PickTaskDialog({
    incompleteTasks,
    selectedTask,
    onSelectTask,
}: Props) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex">
                <DialogTrigger asChild>
                    <Button
                        variant={selectedTask ? 'default' : 'outline'}
                        className="text-xl"
                    >
                        {selectedTask
                            ? `${selectedTask.course?.courseCode ?? 'Other'} - ${selectedTask.name}`
                            : 'Select Your Task'}
                    </Button>
                </DialogTrigger>
                {selectedTask && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectTask(undefined)}
                    >
                        <X />
                    </Button>
                )}
            </div>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Select Your Task</DialogTitle>
                    <DialogDescription className="text-base">
                        Choose a task to focus on during this session.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                    {incompleteTasks.map((task) => (
                        <div key={task.taskId}>
                            <Button
                                variant={
                                    selectedTask?.taskId === task.taskId
                                        ? 'default'
                                        : 'outline'
                                }
                                className="p-4 w-full justify-start text-lg"
                                onClick={() => {
                                    onSelectTask(task);
                                    setOpen(false);
                                }}
                            >
                                {task.course?.courseCode ?? 'Other'} -{' '}
                                {task.name}
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
