"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlanEventCard from "./PlanEventCard";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CalendarRange, MapPin, Clock3, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import {
  mapEventToAgentEvent,
  getEventsWithinTimeRange,
  findDay,
} from "@/lib/utils/event";
import { useSession } from "next-auth/react";

import { generatePlan, revisePlan } from "@/lib/api/agent";
import { addEvent } from "@/lib/api/event";

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
  const { data: session } = useSession();

  const [planningSessionId, setPlanningSessionId] = useState("");
  const [message, setMessage] = useState("");
  const [prepareTime, setPrepareTime] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");
  const [planPhase, setPlanPhase] = useState<"idle" | "planning" | "done">(
    "idle",
  );
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState({
    prepareTime: false,
    intensity: false,
    notes: false,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setPlanningSessionId(crypto.randomUUID());
    setMessage("");
    setPrepareTime("");
    setIntensity("");
    setNotes("");
    setPlanPhase("idle");
    setIsSavingPlan(false);
    setPlanData(null);
    setFieldErrors({
      prepareTime: false,
      intensity: false,
      notes: false,
    });
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!planData || !message.trim() || planPhase === "planning") {
      return;
    }

    await handleRevisePlan();
  };

  const handleStartPlanning = async () => {
    const nextErrors = {
      prepareTime: !prepareTime,
      intensity: !intensity,
      notes: !notes.trim(),
    };

    setFieldErrors(nextErrors);

    if (nextErrors.prepareTime || nextErrors.intensity || nextErrors.notes) {
      return;
    }

    setPlanPhase("planning");

    // Call the API to generate the plan
    const preferences = {
      preparation_time: prepareTime,
      intensity,
      notes,
    };

    const agentEvent = mapEventToAgentEvent(event);

    const { week: startWeek, day: startDay } = findDay(
      event.week,
      event.day,
      parseInt(prepareTime.split(" ")[0]) *
        (prepareTime.includes("day") ? 1 : 7),
    );

    const existingEvents = await getEventsWithinTimeRange(
      session?.user?.id ?? "",
      startWeek,
      startDay,
      "0000",
      event.week,
      event.day,
      event.startTime,
    );

    try {
      const result = await generatePlan(
        agentEvent,
        preferences,
        existingEvents.map((e: any) => mapEventToAgentEvent(e)),
        planningSessionId,
      );
      setPlanData(result);
      setPlanPhase("done");
    } catch (error) {
      setPlanPhase("idle");
      toast.error("Failed to generate plan. Please try again.");
    }
  };

  const handleRevisePlan = async () => {
    if (!planData || !message.trim()) {
      return;
    }

    setPlanPhase("planning");

    try {
      const result = await revisePlan(planningSessionId, message.trim());
      setPlanData(result);
      setMessage("");
      setPlanPhase("done");
    } catch (error) {
      setPlanPhase(planData ? "done" : "idle");
      toast.error("Failed to revise plan. Please try again.");
    }
  };

  const handleSavePlan = async () => {
    if (!planData || !planningSessionId) {
      return;
    }

    const toHHMM = (value: string) => {
      const timePart = value.split("T")[1] ?? value;
      return timePart.slice(0, 5).replace(":", "");
    };

    setIsSavingPlan(true);

    try {
      for (let i = 0; i < planData.events.length - 1; i++) {
        const planEvent = planData.events[i];
        await addEvent(
          session?.user?.id ?? "",
          planEvent.event_type,
          planEvent.title,
          planEvent.week,
          planEvent.day,
          toHHMM(planEvent.start_time),
          toHHMM(planEvent.end_time),
          planEvent.venue,
          event.courseId ?? undefined,
        );
      }
      toast.success("Plan saved successfully!");
    } catch (error) {
      toast.error("Failed to save plan. Please try again.");
    } finally {
      setIsSavingPlan(false);
      onOpenChange(false);
    }
  };

  const renderSuggestedPlan = () => {
    if (planPhase === "planning") {
      return (
        <div className="flex min-h-[20rem] items-center justify-center rounded-3xl border border-dashed border-border/70 bg-gradient-to-b from-muted/20 to-background px-6 py-8 text-center">
          <div className="max-w-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <p className="font-heading text-xl font-semibold text-foreground">
              Agent is planning for you...
            </p>
            <p className="font-sans mt-2 text-sm leading-6 text-muted-foreground">
              The agent is generating your plan right now. This area will update
              when the plan is ready.
            </p>
          </div>
        </div>
      );
    }

    if (planPhase === "done" && planData) {
      const events = planData.events ?? [];

      return (
        <div className="space-y-4 rounded-3xl border border-border/70 bg-background p-5">
          <div className="space-y-2 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold font-sans uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Final plan
            </div>
            <h4 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {planData.plan_title}
            </h4>
            <p className="font-sans text-sm leading-6 text-muted-foreground">
              {planData.strategy}
            </p>
          </div>

          <div className="space-y-4">
            <div className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Suggested flow
            </div>

            {events.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-row lg:items-center lg:overflow-x-auto">
                {events.map((planEvent: any, index: number) => (
                  <PlanEventCard
                    key={`${planEvent.event_id ?? index}-${index}`}
                    event={planEvent}
                    isLast={index === events.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No planned events were returned.
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[20rem] items-center justify-center rounded-3xl border border-dashed border-border/70 bg-gradient-to-b from-muted/20 to-background px-6 py-8 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <p className="font-heading text-xl font-semibold text-foreground">
            Choose preferences to start planning
          </p>
          <p className="font-sans mt-2 text-sm leading-6 text-muted-foreground">
            Select the planning preferences above, add any useful notes, and
            click Start planning when you are ready.
          </p>
        </div>
      </div>
    );
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
                              <SelectItem className="font-sans" value="3 days">
                                3 days
                              </SelectItem>
                              <SelectItem className="font-sans" value="5 days">
                                5 days
                              </SelectItem>
                              <SelectItem className="font-sans" value="1 week">
                                1 week
                              </SelectItem>
                              <SelectItem className="font-sans" value="2 week">
                                2 week
                              </SelectItem>
                              <SelectItem className="font-sans" value="1 month">
                                1 month
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <div className="font-sans text-xs font-medium text-foreground">
                            How much to prepare
                          </div>
                          <Select
                            value={intensity}
                            onValueChange={setIntensity}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-9 w-full max-w-[18rem] rounded-xl border-border/70 font-sans text-sm",
                                fieldErrors.intensity &&
                                  "border-destructive ring-3 ring-destructive/20",
                              )}
                            >
                              <SelectValue placeholder="Select target" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem className="font-sans" value="LIGHT">
                                Light
                              </SelectItem>
                              <SelectItem
                                className="font-sans"
                                value="MODERATE"
                              >
                                Moderate
                              </SelectItem>
                              <SelectItem
                                className="font-sans"
                                value="INTENSIVE"
                              >
                                Intensive
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
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Share resources, number of questions, past year exams, and anything else the agent should use..."
                          className={cn(
                            "min-h-28 rounded-xl border-border/70 bg-background px-4 py-2.5 font-sans text-sm",
                            fieldErrors.notes &&
                              "border-destructive ring-3 ring-destructive/20",
                          )}
                        />
                      </div>

                      <div className="lg:col-span-12 lg:pt-1">
                        <Button
                          type="button"
                          onClick={handleStartPlanning}
                          disabled={planPhase !== "idle"}
                          className="h-9 w-full bg-primary font-sans text-primary-foreground hover:bg-primary/90"
                        >
                          Start planning
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-h-[30rem] overflow-y-auto rounded-3xl border border-dashed border-border/70 bg-gradient-to-b from-muted/20 to-background px-6 py-6">
                  {renderSuggestedPlan()}
                </div>

                <div className="rounded-3xl border border-border/70 bg-background p-4">
                  <form
                    className="flex w-full items-center gap-3 pb-0"
                    onSubmit={handleSubmit}
                  >
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!planData || planPhase === "planning"}
                      placeholder={
                        planData
                          ? "Chat with the agent to adjust the plan..."
                          : "Generate a plan first to chat with the agent..."
                      }
                      className="h-10 flex-1 rounded-xl border-border/70 bg-background px-4 font-sans text-sm"
                    />
                    <Button
                      type="submit"
                      disabled={
                        !planData || !message.trim() || planPhase === "planning"
                      }
                      className="h-10 px-5 font-sans"
                    >
                      Revise plan
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!planData || planPhase === "planning" || isSavingPlan}
                      onClick={handleSavePlan}
                      className="h-10 border-primary/30 px-5 font-sans text-primary hover:border-secondary hover:text-secondary"
                    >
                      {isSavingPlan ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
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
