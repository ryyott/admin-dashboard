"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { generateHours } from "./calendar-utils";

interface CalendarHoursColumnProps {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const CalendarHoursColumn = forwardRef<HTMLDivElement, CalendarHoursColumnProps>(({ onScroll }, ref) => {
  const hours = generateHours();

  return (
    <div className="bg-muted/30 relative flex flex-col border-r">
      <div className="h-12 shrink-0 border-b" />
      <div ref={ref} onScroll={onScroll} className="hide-scrollbar flex-1 overflow-y-auto">
        <div className="relative" style={{ height: `${24 * 64}px` }}>
          {hours.map((hour, index) => (
            <div
              key={hour}
              className={cn(
                "text-muted-foreground absolute flex h-16 w-16 items-start justify-center border-b pr-2 text-xs",
                index === 0 && "border-t",
              )}
              style={{ top: `${index * 64}px` }}
            >
              <span className="mt-[-8px]">{hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CalendarHoursColumn.displayName = "CalendarHoursColumn";
