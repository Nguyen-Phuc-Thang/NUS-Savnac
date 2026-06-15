import React from "react";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  bookmarked: boolean;
  category: string;
  dueDate?: string;
  createdAt: string;
};

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <div className="flex">
      <Table className="w-full table-fixed">
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="h-16 text-base">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    className="border-gray-400 text-base h-7"
                    variant="outline"
                    onClick={() => console.log("completed")}
                  >
                    Mark as completed
                  </Button>
                  <Toggle
                    aria-label="Toggle bookmark"
                    size="sm"
                    variant="outline"
                    className="border-gray-400"
                    onPressedChange={() => console.log("bookmark pressed")}
                  >
                    <BookmarkIcon className="group-data-[state=on]/toggle:fill-foreground" />
                  </Toggle>
                  <Badge variant="default" className="text-base h-8">
                    {task.category}
                  </Badge>
                  <div>
                    <p className="text-xl font-bold">{task.title}</p>
                    <p className="text-sm">{task.description}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("edit")}
                  >
                    <SquarePen />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("remove")}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
