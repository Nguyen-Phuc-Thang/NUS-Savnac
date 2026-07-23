import { ArrowDown, ArrowRight } from "lucide-react";

export default function PlanEventCard({
  event,
  isLast,
}: {
  event: any;
  isLast: boolean;
}) {
  const backgroundColor =
    event.event_type === "DEADLINE" ? "#F87171" : "#FBB24E";

  const formatTime = (time?: string) => {
    if (!time) {
      return "--:--";
    }

    if (time.length >= 16) {
      return time.slice(11, 16);
    }

    return time;
  };

  return (
    <div className="flex min-w-[17rem] flex-col items-center">
      <div
        className="flex aspect-square w-[17rem] flex-col overflow-hidden rounded-2xl border border-black/10 p-4 text-left shadow-md"
        style={{ backgroundColor }}
      >
        <div>
          <div className="font-heading text-lg font-semibold tracking-tight text-white">
            {event.title}
          </div>
        </div>

        <div className="font-sans text-sm text-white mt-2">
          <div>
            <span className="font-semibold">Week: </span>
            {event.week}
          </div>
          <div>
            <span className="font-semibold">Day: </span>
            {event.day}
          </div>
          <div>
            <span className="font-semibold">Time: </span>
            {formatTime(event.start_time)} -&gt; {formatTime(event.end_time)}
          </div>
        </div>
      </div>
    </div>
  );
}
