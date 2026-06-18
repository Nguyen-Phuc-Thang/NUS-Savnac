"use client";

import { InputTask } from "@/components/task-dialog";
import { Task } from "@/components/task-list";
import { useState } from "react";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: crypto.randomUUID(),
      title: "A sample Overdue Task on 15 June",
      completed: false,
      bookmarked: false,
      category: "CS1234",
      dueDate: "2026-06-15",
      createdAt: new Date().toLocaleString("en-CA"),
    },
    {
      id: crypto.randomUUID(),
      title: "A sample Task with description",
      description: "This is description",
      completed: false,
      bookmarked: false,
      category: "CS5678",
      dueDate: "2026-08-30",
      createdAt: new Date().toLocaleString("en-CA"),
    },
  ]);

  const handleAddTask = (input: InputTask) => {
    // Append newTask to tasks
    const newTask = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? "",
      completed: false,
      bookmarked: input.bookmarked,
      category: input.category,
      dueDate: input.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleToggleBookmark = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, bookmarked: !task.bookmarked } : task,
      ),
    );
  };

  const handleEditTask = (id: string, input: InputTask) => {
    // For a given id of task, edit the task
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? // Override specific fields (of InputTask) in task with values from input
            { ...task, ...input }
          : task,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return {
    tasks,
    handleAddTask,
    handleToggleCompleted,
    handleToggleBookmark,
    handleEditTask,
    handleDelete,
  };
};

export default useTasks;
