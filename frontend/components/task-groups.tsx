import CollapsibleSection from "@/components/collapsible-section";
import { Separator } from "@/components/ui/separator";
import TaskList, { Task } from "@/components/task-list";
import { InputTask } from "./task-dialog";

function compareDates(date1?: string, date2?: string) {
  if (!date1 && !date2) {
    return 0;
  } else if (!date2) {
    return -1;
  } else if (!date1) {
    return 1;
  }
  const d1 = new Date(`${date1}T00:00:00`).getTime();
  const d2 = new Date(`${date2}T00:00:00`).getTime();
  return d1 - d2;
}

export type TaskGroupEntries = [string, Task[] | undefined][];

interface Props {
  tasks: Task[];
  onToggleCompleted: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onEditTask: (id: string, updated: InputTask) => void;
  onDelete: (id: string) => void;
}

const TaskGroups = ({
  tasks,
  onToggleCompleted,
  onToggleBookmark,
  onEditTask,
  onDelete,
}: Props) => {
  // Sort and group the tasks by due date
  const sortedTasks = tasks.toSorted((task1, task2) =>
    compareDates(task1.dueDate, task2.dueDate),
  );

  // A function to check if task if overdue
  const isOverdue = (dueDate: string) =>
    new Date(`${dueDate}T00:00:00`).setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0);

  // A function to compute day difference from today
  const overDueBy = (dueDate: string) => {
    const diffInMs = Math.abs(
      new Date().setHours(0, 0, 0, 0) -
        new Date(`${dueDate}T00:00:00`).setHours(0, 0, 0, 0),
    );
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  };

  // Object.groupBy returns a dictionary
  // e.g. {2026-03-02: [{task1}, {task2], 2026-03-04: [{task3}]}
  // Object.entries convert it to 2D array
  // e.g. [["2026-03-02",[{ task1 }, { task2 }]], ["2026-03-04",[{ task3 }]]]
  //                                              ^        a group         ^
  const groupedTaskByDate = Object.entries(
    Object.groupBy(sortedTasks, (task) =>
      task.dueDate
        ? isOverdue(task.dueDate)
          ? "Overdue by " + overDueBy(task.dueDate) + " Day(s)"
          : task.dueDate
        : "Unscheduled",
    ),
  );

  return (
    <div>
      {groupedTaskByDate.map((group) => (
        <div key={group[0]}>
          <CollapsibleSection title={group[0]}>
            <TaskList
              tasks={group[1] ? group[1] : []}
              onToggleCompleted={onToggleCompleted}
              onToggleBookmark={onToggleBookmark}
              onEditTask={onEditTask}
              onDelete={onDelete}
            />
          </CollapsibleSection>
          <Separator className="mt-2 mb-2" />
        </div>
      ))}
    </div>
  );
};

export default TaskGroups;
