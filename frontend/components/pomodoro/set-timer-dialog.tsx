import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

interface Props {
    mode: 'add' | 'edit';
}

export default function SetTimerDialog({ mode }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {mode === 'add' ? (
                    <Button>Add Timer</Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        {mode == 'add' ? 'Add' : 'Edit'} Timer
                    </DialogTitle>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name-1">Name</Label>
                        <Input required id="name-1" name="name" />
                    </Field>
                    <div className="flex gap-4">
                        <Field className="flex-1">
                            <Label htmlFor="focus">Focus Time</Label>
                            <Input
                                required
                                id="focus"
                                type="number"
                                placeholder="25"
                                min={0}
                                step={1}
                            />
                        </Field>

                        <Field className="flex-1">
                            <Label htmlFor="break">Break Time</Label>
                            <Input
                                required
                                id="break"
                                type="number"
                                placeholder="5"
                                min={0}
                                step={1}
                            />
                        </Field>
                    </div>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose />
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
