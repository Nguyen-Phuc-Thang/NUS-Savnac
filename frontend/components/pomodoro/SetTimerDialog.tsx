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
import { TimerConfig, TimerInput } from '@/types/timer';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

interface Props {
    mode: 'add' | 'edit';
    timer?: TimerConfig;
    onTimerSubmit: (input: TimerInput) => void;
}

export default function SetTimerDialog({ mode, timer, onTimerSubmit }: Props) {
    const emptyInput: TimerInput = {
        name: '',
        focusMinutes: 25,
        focusSeconds: 0,
        breakMinutes: 5,
        breakSeconds: 0,
    };

    const [inputTimer, setInputTimer] = useState(emptyInput);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setDialogOpen(isOpen);
        if (isOpen && mode === 'edit' && timer) {
            setInputTimer({
                name: timer.name,
                focusMinutes: Math.floor(timer.focusTime / 60),
                focusSeconds: timer.focusTime % 60,
                breakMinutes: Math.floor(timer.breakTime / 60),
                breakSeconds: timer.breakTime % 60,
            });
        } else {
            // Ensures fresh dialog on add task
            setInputTimer(emptyInput);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {mode === 'add' ? (
                    <Button className="text-lg">Add Timer</Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onTimerSubmit(inputTimer);
                        setDialogOpen(false);
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="pb-2 text-xl">
                            {mode == 'add' ? 'Add' : 'Edit'} Timer
                        </DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name" className="text-lg">
                                Name
                            </Label>
                            <Input
                                required
                                id="name"
                                name="name"
                                value={inputTimer.name}
                                onChange={(e) =>
                                    setInputTimer((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </Field>

                        <div className="flex gap-4">
                            <Field className="flex-1">
                                <Label
                                    htmlFor="focus-minutes"
                                    className="text-lg"
                                >
                                    Focus Time
                                </Label>

                                <div className="flex items-center gap-2">
                                    <Input
                                        required
                                        id="focus-minutes"
                                        name="focus-minutes"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={inputTimer.focusMinutes}
                                        onChange={(e) =>
                                            setInputTimer((prev) => ({
                                                ...prev,
                                                focusMinutes: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        min
                                    </span>

                                    <Input
                                        required
                                        id="focus-seconds"
                                        type="number"
                                        min={0}
                                        max={59}
                                        step={1}
                                        value={inputTimer.focusSeconds}
                                        onChange={(e) =>
                                            setInputTimer((prev) => ({
                                                ...prev,
                                                focusSeconds: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        sec
                                    </span>
                                </div>
                            </Field>

                            <Field className="flex-1">
                                <Label
                                    htmlFor="break-minutes"
                                    className="text-lg"
                                >
                                    Break Time
                                </Label>

                                <div className="flex items-center gap-2">
                                    <Input
                                        required
                                        id="break-minutes"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={inputTimer.breakMinutes}
                                        onChange={(e) =>
                                            setInputTimer((prev) => ({
                                                ...prev,
                                                breakMinutes: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        min
                                    </span>

                                    <Input
                                        required
                                        id="break-seconds"
                                        type="number"
                                        min={0}
                                        max={59}
                                        step={1}
                                        value={inputTimer.breakSeconds}
                                        onChange={(e) =>
                                            setInputTimer((prev) => ({
                                                ...prev,
                                                breakSeconds: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        sec
                                    </span>
                                </div>
                            </Field>
                        </div>
                        <div />
                    </FieldGroup>

                    <DialogFooter className="pt-4 flex flex-row justify-end gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
