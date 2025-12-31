"use client";

import { cn } from "@/lib/utils";

import type { Event } from "../_data/events";

import { calculateDuration } from "./calendar-utils";

interface EventCardProps {
  event: Event;
  style?: React.CSSProperties;
  onClick?: () => void;
  isSearchMatch?: boolean;
  isSearchActive?: boolean;
}

export function EventCard({ event, style, onClick, isSearchMatch = true, isSearchActive = false }: EventCardProps) {
  const duration = calculateDuration(event.startTime, event.endTime);

  // Determine visual state based on search
  const getSearchStyles = () => {
    if (!isSearchActive) return "";
    if (isSearchMatch) {
      return "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-lg";
    }
    return "opacity-30";
  };

  // Very short events (< 30 minutes) - ultra minimal
  if (duration < 30) {
    return (
      <div
        onClick={onClick}
        style={style}
        className={cn(
          "group absolute right-0 left-0 cursor-pointer overflow-hidden rounded-lg border px-2.5 py-1.5",
          "bg-card text-card-foreground",
          "hover:bg-accent/50 hover:shadow-md",
          "transition-all duration-200",
          getSearchStyles(),
        )}
      >
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            {event.meetingLink && <div className="bg-primary size-1.5 shrink-0 rounded-full" />}
            <span className="truncate text-xs font-medium">{event.title}</span>
          </div>
          <span className="text-muted-foreground shrink-0 text-[11px]">{event.startTime}</span>
        </div>
      </div>
    );
  }

  // Medium events (30-60 minutes) - clean and simple
  if (duration < 60) {
    return (
      <div
        onClick={onClick}
        style={style}
        className={cn(
          "group absolute right-0 left-0 cursor-pointer overflow-hidden rounded-lg border px-2.5 py-1.5",
          "bg-card text-card-foreground",
          "hover:bg-accent/50 hover:shadow-md",
          "transition-all duration-200",
          getSearchStyles(),
        )}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 flex-1 items-start gap-1.5">
            {event.meetingLink && <div className="bg-primary mt-1 size-1.5 shrink-0 rounded-full" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs leading-tight font-medium">{event.title}</p>
              {event.location && <p className="text-muted-foreground mt-0.5 truncate text-[11px]">{event.location}</p>}
            </div>
          </div>
          <div className="text-muted-foreground flex shrink-0 flex-col items-end gap-0.5 text-[11px]">
            <span>{event.startTime}</span>
            {event.timezone && <span className="text-[10px] opacity-70">{event.timezone.split(" ")[0]}</span>}
          </div>
        </div>
      </div>
    );
  }

  // Standard events (>= 60 minutes) - full card with more details
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "group absolute right-0 left-0 cursor-pointer overflow-hidden rounded-lg border px-2.5 py-2",
        "bg-card text-card-foreground",
        "hover:bg-accent/50 hover:shadow-md",
        "transition-all duration-200",
        getSearchStyles(),
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 flex-1 items-start gap-1.5">
          {event.meetingLink && <div className="bg-primary mt-1 size-1.5 shrink-0 rounded-full" />}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="line-clamp-2 text-xs leading-tight font-semibold">{event.title}</p>
            {event.location && <p className="text-muted-foreground truncate text-[11px]">{event.location}</p>}
            {event.participants.length > 0 && (
              <p className="text-muted-foreground text-[11px]">
                {event.participants.length} {event.participants.length === 1 ? "person" : "people"}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="text-muted-foreground text-[11px]">{event.startTime}</span>
          <span className="text-muted-foreground text-[11px]">-</span>
          <span className="text-muted-foreground text-[11px]">{event.endTime}</span>
          {event.timezone && (
            <span className="text-muted-foreground mt-0.5 text-[10px] opacity-70">{event.timezone.split(" ")[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
