"use client";

import { cn } from "@/lib/utils";

import type { Event } from "../_data/events";

import { calculateEventHeight, calculateEventTop, generateHours, HOUR_HEIGHT, isToday } from "./calendar-utils";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { EventCard } from "./event-card";

interface CalendarDayColumnProps {
  date: Date;
  events: Event[];
  currentTime: string;
  onEventClick: (event: Event) => void;
  searchQuery?: string;
}

export function CalendarDayColumn({
  date,
  events,
  currentTime,
  onEventClick,
  searchQuery = "",
}: CalendarDayColumnProps) {
  const hours = generateHours();
  const isTodayColumn = isToday(date);

  return (
    <div className="relative flex min-w-0 flex-1 flex-col border-r last:border-r-0">
      <div className="relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
        {/* Hour grid lines */}
        {hours.map((hour, index) => (
          <div
            key={hour}
            className={cn(
              "absolute right-0 left-0 border-b",
              index === 0 && "border-t",
              isTodayColumn && "bg-primary/[0.02]",
            )}
            style={{ top: `${index * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
          />
        ))}

        {/* Events */}
        <div className="absolute inset-0 px-1">
          {events.map((event) => {
            const matchesSearch = searchQuery === "" || event.title.toLowerCase().includes(searchQuery.toLowerCase());

            return (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
                isSearchMatch={matchesSearch}
                isSearchActive={searchQuery !== ""}
                style={{
                  top: `${calculateEventTop(event.startTime)}px`,
                  height: `${calculateEventHeight(event.startTime, event.endTime)}px`,
                }}
              />
            );
          })}
        </div>

        {/* Current time indicator - only show for today */}
        {isTodayColumn && (
          <div className="pointer-events-none absolute inset-0 px-1">
            <CurrentTimeIndicator currentTime={currentTime} />
          </div>
        )}
      </div>
    </div>
  );
}
