"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CalendarRange, MapPin, Clock3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
}

export default function AgentChatDialog({
  open,
  onOpenChange,
  event,
}: AgentDialogProps) {
  const [message, setMessage] = useState("");
  const [prepareTime, setPrepareTime] = useState("");
  const [studyIntensity, setStudyIntensity] = useState("");
  const [resources, setResources] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    prepareTime: false,
    studyIntensity: false,
    resources: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
  };

  const handleStartPlanning = () => {
    const nextErrors = {
      prepareTime: !prepareTime,
      studyIntensity: !studyIntensity,
      resources: !resources.trim(),
    };

    setFieldErrors(nextErrors);

    if (
      nextErrors.prepareTime ||
      nextErrors.studyIntensity ||
      nextErrors.resources
    ) {
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90dvh] w-[80vw] max-w-none overflow-hidden p-0">
        <div className="flex h-full flex-col overflow-hidden bg-background">
          <DialogHeader className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-background to-secondary/10 px-8 py-4">
            <DialogTitle className="font-heading text-3xl tracking-tight text-foreground">
              AI Planner
            </DialogTitle>
            <div className="font-sans text-sm text-muted-foreground">
              Shape this event plan with the agent before saving it.
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm">
                <div className="flex items-start gap-4 bg-gradient-to-r from-primary/10 via-background to-secondary/10 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <CalendarRange className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {event?.eventType ?? "Event"}
                      </span>
                      <span className="font-sans text-sm font-medium text-muted-foreground">
                        Planning details
                      </span>
                    </div>
                    <h3 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      {event?.title ?? "Untitled event"}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 px-5 py-4 lg:grid-cols-12">
                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 lg:col-span-7">
                    <div className="font-sans mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      Time
                    </div>
                    <div className="font-sans text-sm font-medium leading-5 text-foreground">
                      Start: {event?.week ?? "-"}, {event?.day ?? "-"}{" "}
                      {event?.startTime ?? "--:--"}
                    </div>
                    <div className="font-sans text-sm font-medium text-foreground">
                      End: {event?.week ?? "-"}, {event?.day ?? "-"}{" "}
                      {event?.endTime ?? "--:--"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 lg:col-span-3">
                    <div className="font-sans mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Venue
                    </div>
                    <div className="font-sans text-sm font-medium leading-5 text-foreground">
                      {event?.venue ?? "Venue not set"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 lg:col-span-12">
                    <div className="font-sans mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Planning preferences
                    </div>
                    <div className="grid gap-3 lg:grid-cols-12">
                      <div className="space-y-3 lg:col-span-3">
                        <div className="space-y-1.5">
                          <div className="font-sans text-xs font-medium text-foreground">
                            How long to prepare before the exam
                          </div>
                          <Select
                            value={prepareTime}
                            onValueChange={setPrepareTime}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-9 w-full max-w-[18rem] rounded-xl border-border/70 font-sans text-sm",
                                fieldErrors.prepareTime &&
                                  "border-destructive ring-3 ring-destructive/20",
                              )}
                            >
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3 days">3 days</SelectItem>
                              <SelectItem value="5 days">5 days</SelectItem>
                              <SelectItem value="1 week">1 week</SelectItem>
                              <SelectItem value="2 week">2 week</SelectItem>
                              <SelectItem value="1 month">1 month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <div className="font-sans text-xs font-medium text-foreground">
                            How much to prepare
                          </div>
                          <Select
                            value={studyIntensity}
                            onValueChange={setStudyIntensity}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-9 w-full max-w-[18rem] rounded-xl border-border/70 font-sans text-sm",
                                fieldErrors.studyIntensity &&
                                  "border-destructive ring-3 ring-destructive/20",
                              )}
                            >
                              <SelectValue placeholder="Select target" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Chill">Chill</SelectItem>
                              <SelectItem value="I must get A+">
                                I must get A+
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5 lg:col-span-9">
                        <div className="font-sans text-xs font-medium text-foreground">
                          Resources and notes
                        </div>
                        <Textarea
                          value={resources}
                          onChange={(e) => setResources(e.target.value)}
                          placeholder="Share resources, number of questions, past year exams, and anything else the agent should use..."
                          className={cn(
                            "min-h-28 rounded-xl border-border/70 bg-background px-4 py-2.5 font-sans text-sm",
                            fieldErrors.resources &&
                              "border-destructive ring-3 ring-destructive/20",
                          )}
                        />
                      </div>

                      <div className="lg:col-span-12 lg:pt-1">
                        <Button
                          type="button"
                          onClick={handleStartPlanning}
                          className="h-9 w-full bg-primary font-sans text-primary-foreground hover:bg-primary/90"
                        >
                          Start planning
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-h-[28rem] overflow-y-auto rounded-3xl border border-dashed border-border/70 bg-gradient-to-b from-muted/20 to-background px-6 py-8 text-center">
                  <div className="mx-auto max-w-md py-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <p className="font-heading text-xl font-semibold text-foreground">
                      Agent is planning for you...
                    </p>
                    <p className="font-sans mt-2 text-sm leading-6 text-muted-foreground">
                      Your suggested plan will appear here while the agent works
                      through the event details.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-border/70 bg-background p-4">
                  <form
                    className="flex w-full items-center gap-3 pb-0"
                    onSubmit={handleSubmit}
                  >
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Chat with the agent to adjust the plan..."
                      className="h-10 flex-1 rounded-xl border-border/70 bg-background px-4 font-sans text-sm"
                    />
                    <Button type="submit" className="sr-only">
                      Send message
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 border-primary/30 px-5 font-sans text-primary hover:border-secondary hover:text-secondary"
                    >
                      Save plan
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
