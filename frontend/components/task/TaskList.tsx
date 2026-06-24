"use client";

// React Hooks
import { useState } from "react";

// UI Componen
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface TaskListProps {
    tasks: any[];
    type: "WEEKLY" | "TODAY";
    onAdd: (type: "WEEKLY" | "TODAY", name: string) => void;
    onToggle: (taskId: string) => void;
    onUpdate: (taskId: string, newName: string) => void;
    onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, type, onAdd, onToggle, onUpdate, onDelete }: TaskListProps) {


    const [isEntering, setIsEntering] = useState(false);
    const [taskNameInput, setTaskNameInput] = useState("");
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskName, setEditingTaskName] = useState("");

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAdd(type, taskNameInput);
            setTaskNameInput("");
            setIsEntering(false);
        }
    }

    const startEditingTask = (task: any) => {
        setEditingTaskId(task.taskId);
        setEditingTaskName(task.name);
    }

    const saveEditingTask = (taskId: string) => {
        const nextName = editingTaskName.trim();

        if (nextName && nextName !== tasks.find((task) => task.taskId === taskId)?.name) {
            onUpdate(taskId, nextName);
        }

        setEditingTaskId(null);
        setEditingTaskName("");
    }

    const handleToggleTask = (taskId: string) => {
        onToggle(taskId);
    }

    return (
        <div className='mt-2 overflow-y-auto h-full'>
            {
                tasks.map((task) => (
                    <div className='flex flex-row items-center gap-2' key={task.taskId}>
                        <Checkbox checked={task.completed} onCheckedChange={() => handleToggleTask(task.taskId)} />
                        {editingTaskId === task.taskId ? (
                            <Input
                                autoFocus
                                value={editingTaskName}
                                onChange={(e) => setEditingTaskName(e.target.value)}
                                onBlur={() => saveEditingTask(task.taskId)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        saveEditingTask(task.taskId);
                                    }
                                }}
                                className='ml-2 h-8 flex-1'
                            />
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => startEditingTask(task)}
                                className='ml-2 h-auto flex-1 justify-start p-0 font-normal text-left hover:bg-transparent hover:text-primary'
                            >
                                {task.name}
                            </Button>
                        )}
                        {editingTaskId === task.taskId && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onDelete(task.taskId)}
                                className='h-8 w-8 shrink-0 border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-destructive'
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))
            }

            {
                isEntering ? (
                    <div className='flex flex-row items-center justify-center mt-2'>
                        <Input placeholder="Enter task name..." value={taskNameInput} onChange={(e) => setTaskNameInput(e.target.value)} onKeyDown={handleOnKeyDown} />
                        <Button className='ml-1 rounded-md bg-white hover:bg-white text-black' onClick={() => setIsEntering(false)}>
                            <Minus />
                        </Button>
                    </div>
                ) : (
                    <Button className='mt-2 border rounded-md bg-white hover:bg-white text-black' onClick={() => setIsEntering(true)}>
                        <Plus />
                    </Button>
                )
            }

        </div>
    )
}