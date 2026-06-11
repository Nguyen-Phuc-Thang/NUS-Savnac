"use client";
// import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import AddTaskDialog from "@/components/add-task-dialog";
import CollapsibleTaskList from "@/components/collapsible-task-list";
import DropdownButton from "@/components/dropdown-button";
import TaskList, { TaskProps } from "@/components/task-list";

const sampleTasks = [
  {
    id: "1",
    description: "Submit CS2030S Problem Set 3",
    bookmarked: true,
    course: "CS2030S",
    priority: "High",
    due: "Today",
  },
];

const TaskPage = () => {
  return (
    <div className="min-h-screen bg-white px-6 pt-3">
      {/*Top bar*/}
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          {/* Title*/}
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Task List
          </h2>
          {/* Add Button*/}
          <AddTaskDialog />
        </div>

        {/* RHS of Top Bar*/}
        <div className="flex gap-2">
          <DropdownButton
            label="Sort"
            items={["Alphabetical", "Courses", "Importance Level"]}
          />
          <DropdownButton
            label="View"
            items={["Default", "Starred", "Important"]}
          />
        </div>
      </div>

      <Separator />
      {/* Task List*/}
      <div>
        {/*Today*/}
        <CollapsibleTaskList title="TODAY">
          <TaskList tasks={sampleTasks} />
        </CollapsibleTaskList>

        <br />
        <Separator />
        {/*This week*/}
        <CollapsibleTaskList title="THIS WEEK">
          {/* <TaskList tasks={tasks} /> */}
          <p>Placeholder</p>
        </CollapsibleTaskList>
      </div>

      <br />
      <Separator />
    </div>
  );
};

export default TaskPage;
