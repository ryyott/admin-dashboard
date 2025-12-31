"use client";

import { generateHours, HOUR_HEIGHT } from "./calendar-utils";

export function CalendarTimeColumn() {
  const hours = generateHours();

  return (
    <div className="bg-muted/20 w-16 shrink-0 border-r">
      <div className="relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
        {hours.map((hour, index) => (
          <div
            key={hour}
            className="text-muted-foreground absolute right-0 left-0 flex items-start justify-center border-b pt-1 pr-2 text-xs"
            style={{ top: `${index * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
          >
            <span>{hour}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
