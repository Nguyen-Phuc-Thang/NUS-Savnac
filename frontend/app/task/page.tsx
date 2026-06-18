"use client";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import TaskDialog from "@/components/task-dialog";
import DropdownButton, { DropdownItem } from "@/components/dropdown-button";
import TaskGroups from "@/components/task-groups";
import SearchBar from "@/components/search-bar";
import useTasks from "@/hooks/use-tasks";

const dropdownFilters = [
  { label: "Active", id: "active" },
  { label: "Completed", id: "completed" },
  { label: "Bookmarked", id: "bookmarked" },
] satisfies DropdownItem[];

const TaskListPage = () => {
  const {
    tasks,
    handleAddTask,
    handleToggleCompleted,
    handleToggleBookmark,
    handleEditTask,
    handleDelete,
  } = useTasks();

  const [filter, setFilter] = useState("active");

  const filteredTasks = tasks.filter((task) =>
    filter === "active"
      ? !task.completed
      : filter === "completed"
        ? task.completed
        : filter === "bookmarked"
          ? task.bookmarked && !task.completed
          : true,
  );

  const handleFilterChoice = (filter: string) => {
    setFilter(filter);
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
          <DropdownButton
            label="Filter"
            items={dropdownFilters}
            onSelect={handleFilterChoice}
          />
        </div>
      </div>

      <div className="mb-2">
        <SearchBar />
      </div>

      <Separator className="mt-2 mb-2" />
      {/**Tasks */}
      <TaskGroups
        tasks={filteredTasks}
        onToggleCompleted={handleToggleCompleted}
        onToggleBookmark={handleToggleBookmark}
        onEditTask={handleEditTask}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TaskListPage;
