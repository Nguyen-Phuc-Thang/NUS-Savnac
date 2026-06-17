"use client";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import TaskDialog, { InputTask } from "@/components/task-dialog";
import DropdownButton, { DropdownItem } from "@/components/dropdown-button";
import TaskGroups from "@/components/task-groups";
import SearchBar from "@/components/search-bar";
import { Task } from "@/components/task-list";

// Label for UI, value for logic
const filters = [
  { label: "Default", value: "default" },
  { label: "Completed", value: "completed" },
  { label: "Bookmarked", value: "bookmarked" },
] satisfies DropdownItem[];

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: crypto.randomUUID(),
      title: "Milestone 2 Advisor Consult",
      description: "10pm",
      completed: false,
      bookmarked: false,
      category: "CS2030S",
      dueDate: "2026-06-18",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Mock Interview",
      description: "10AM",
      completed: false,
      bookmarked: false,
      category: "CS2030S",
      dueDate: "2026-06-19",
      createdAt: new Date().toISOString(),
    },
  ]);

  // (prev) => [...prev, {
  //       id: crypto.randomUUID(),
  //       title: input.title,
  //       description: input.description ?? "",
  //       bookmarked: input.bookmarked,
  //       category: input.category,
  //       dueDate: input.dueDate,
  //       completed: false,
  //       createdAt: new Date().toISOString(),
  //     }]
  // (prev) =>
  //       prev.map((t) => (t.id === id ? { ...t, ...input } : t)),

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

  const handleEditTask = (id: string, input: InputTask) => {
    // For a given id of task, edit the task
    // Don't use filter since it delete items
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? // Override specific fields (of InputTask) in task with values from input
            { ...task, ...input }
          : task,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-3">
      <div className="flex w-full justify-between items-center">
        {/**LHS of Top Bar */}
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Tasks
          </h2>
          <TaskDialog action="addTask" onTaskSubmit={handleAddTask} />
        </div>

        {/**RHS of Top Bar */}
        <div className="flex gap-2">
          <DropdownButton label="Filter" items={filters} />
        </div>
      </div>

      <div className="mb-2">
        <SearchBar />
      </div>

      <Separator className="mt-2 mb-2" />
      {/**Tasks */}
      <TaskGroups tasks={tasks} onEditTask={handleEditTask} />
    </div>
  );
};

export default TaskListPage;
