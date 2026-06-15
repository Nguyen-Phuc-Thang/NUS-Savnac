import CollapsibleSection from "@/components/collapsible-section";
import TaskList, { Task } from "@/components/task-list";

interface Props {
  tasks: Task[];
}

function compareDates(date1?: string, date2?: string) {
  if (!date1 && !date2) {
    return 0;
  } else if (!date2) {
    return -1;
  } else if (!date1) {
    return 1;
  }
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return d1 - d2;
}

const TaskGroup = ({ tasks }: Props) => {
  // Sort and group the tasks by due date
  const sortedTasks = tasks.toSorted((task1, task2) =>
    compareDates(task1.dueDate, task2.dueDate),
  );
  // Object.groupBy returns a dictionary
  // e.g. {2026-03-02: [{task1}, {task2], 2026-03-04: [{task3}]}
  // Object.entries convert it to 2D array
  // e.g. [["2026-03-02",[{ task1 }, { task2 }]], ["2026-03-04",[{ task3 }]]]
  //                                              ^        a group         ^ 
  const groupedTasks = Object.entries(
    Object.groupBy(sortedTasks, (task) =>
      task.dueDate ? task.dueDate : "Unscheduled",
    ),
  );

  return (
    <div>
      {groupedTasks.map(group => (
        <CollapsibleSection key={group[0]} title={group[0]}>
          <TaskList tasks={group[1] ? group[1] : []} />
        </CollapsibleSection>
      ))}
    </div>
  );
};

export default TaskGroup;
