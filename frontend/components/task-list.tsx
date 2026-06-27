import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BookmarkIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// export type Priority = "High" | "Medium" | "Low";

export interface TaskProps {
  id: string;
  description: string;
  bookmarked: boolean;
  course: string;
  priority: string;
  due: string;
}

interface TaskListProps {
  tasks: TaskProps[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <div className="flex">
      <Table>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="flex items-center gap-2">
                <Checkbox />
                <Toggle
                  aria-label="Toggle bookmark"
                  size="sm"
                  variant="outline"
                >
                  <BookmarkIcon className="group-data-[state=on]/toggle:fill-foreground" />
                </Toggle>
              </TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <Badge variant="default">{task.course}</Badge>
                <Badge variant="outline">{task.priority}</Badge>
                <Badge variant="secondary">{task.due}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
