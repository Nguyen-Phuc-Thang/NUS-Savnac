"use client";
import { Separator } from "@/components/ui/separator";
import TaskDialog from "@/components/task-dialog";
import DropdownButton, { DropdownItem } from "@/components/dropdown-button";
import TaskGroup from "@/components/task-group";
import SearchBar from "@/components/search-bar";

const tasks = [
  {
    id: crypto.randomUUID(),
    title: "Review Recitation 3",
    description: "Question 2: Tell Don't Ask",
    completed: false,
    bookmarked: false,
    category: "CS2030S",
    dueDate: "2026-06-15",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Task 2",
    description: "Question 2: Tell Don't Ask",
    completed: false,
    bookmarked: false,
    category: "CS2030S",
    dueDate: "2026-06-16",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Task 2",
    description: "Question 2: Tell Don't Ask",
    completed: false,
    bookmarked: false,
    category: "CS2030S",
    dueDate: "2026-06-14",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Task 2",
    description: "Question 2: Tell Don't Ask",
    completed: false,
    bookmarked: false,
    category: "CS2030S",
    dueDate: undefined,
    createdAt: new Date().toISOString(),
  },
];

// Label for UI, value for logic
const filters = [
  { label: "Default", value: "default" },
  { label: "Completed", value: "completed" },
  { label: "Bookmarked", value: "bookmarked" },
] satisfies DropdownItem[];

const TaskListPage = () => {
  return (
    <div className="min-h-screen bg-white px-6 pt-3">
      {/**Top Bar */}
      <div className="flex w-full justify-between items-center">
        {/**LHS of Top Bar */}
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Tasks
          </h2>
          <TaskDialog />
        </div>

        {/**RHS of Top Bar */}
        <div className="flex gap-2">
          <DropdownButton label="Filter" items={filters} />
        </div>
      </div>

      <SearchBar />

      <Separator className="mt-2" />
      {/**Tasks */}
      <TaskGroup tasks={tasks}></TaskGroup>

      <br />
      <Separator className="mt-2" />
    </div>
  );
};

export default TaskListPage;
