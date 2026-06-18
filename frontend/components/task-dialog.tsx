"use client";

import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DatePickerInput from "@/components/date-picker-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/components/task-list";

export type InputTask = {
  title: string;
  description?: string;
  bookmarked: boolean;
  category: string;
  dueDate?: string;
};

interface Props {
  action: "addTask" | "editTask";
  task?: Task;
  // a function that add/update task
  onTaskSubmit: (input: InputTask) => void;
}

export default function TaskDialog({ action, task, onTaskSubmit }: Props) {
  const emptyInput = {
    title: "",
    description: "",
    bookmarked: false,
    category: "",
    dueDate: undefined,
  };

  // Use states to handle the InputTask
  const [inputTask, setInputTask] = useState<InputTask>(emptyInput);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (isOpen) {
      if (action === "editTask" && task) {
        setInputTask({
          title: task.title,
          description: task.description,
          bookmarked: task.bookmarked,
          category: task.category,
          dueDate: task.dueDate,
        });
      } else {
        setInputTask(emptyInput);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        <Button
          title={action === "addTask" ? "Add Task" : "Edit Task"}
          variant="outline"
          size="icon"
        >
          {action === "addTask" ? <Plus /> : <SquarePen />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {/**Move the form here to avoid conflict */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onTaskSubmit(inputTask);
            setDialogOpen(false);
          }}
        >
          <DialogHeader className="mb-2">
            <DialogTitle>
              {action === "addTask" ? "Add" : "Edit"} Task
            </DialogTitle>
            <DialogDescription>*Required</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                name="title"
                value={inputTask.title}
                onChange={(e) =>
                  setInputTask((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
              />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={inputTask.description}
                onChange={(e) =>
                  setInputTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="bookmarked"
                name="bookmarked"
                className="border-gray-400"
                checked={inputTask.bookmarked}
                onCheckedChange={(checked) =>
                  setInputTask((prev) => ({
                    ...prev,
                    bookmarked: checked === true,
                  }))
                }
              />
              <FieldLabel htmlFor="bookmarked" className="font-normal">
                Set as bookmarked
              </FieldLabel>
            </Field>
            <div className="flex w-full items-end gap-4">
              <Field>
                <Label htmlFor="category">Course/Category*</Label>
                <Input
                  id="category"
                  name="category"
                  value={inputTask.category}
                  onChange={(e) =>
                    setInputTask((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <DatePickerInput
                dueDate={inputTask.dueDate}
                onDateChange={(selectedDate) => {
                  setInputTask((prev) => ({
                    ...prev,
                    dueDate: selectedDate,
                  }));
                }}
              />
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">
              {action === "addTask" ? "Add" : "Edit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
