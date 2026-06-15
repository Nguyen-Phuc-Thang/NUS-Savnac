"use client";

import { Plus } from "lucide-react";

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

export default function TaskDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>addedit Task</DialogTitle>
            <DialogDescription>*Required</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title*</Label>
              <Input id="title" name="name" defaultValue="New Task" required />
            </Field>
            <Field>
              <Label htmlFor="Description">Description</Label>
              <Input id="Description" name="Description" />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="bookmarked" className="border-gray-400" />
              <FieldLabel htmlFor="bookmarked" className="font-normal">
                Set as bookmarked
              </FieldLabel>
            </Field>
            <div className="flex w-full items-end gap-4">
              <Field>
                <Label htmlFor="category">Category*</Label>
                <Input id="category" name="category" required />
              </Field>
              <DatePickerInput />
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">addedit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
