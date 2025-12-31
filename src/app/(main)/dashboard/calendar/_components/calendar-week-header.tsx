"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { isToday } from "./calendar-utils";

interface CalendarWeekHeaderProps {
  weekDays: Date[];
}

export function CalendarWeekHeader({ weekDays }: CalendarWeekHeaderProps) {
  return (
    <div className="flex border-b">
      {/* Spacer for time column */}
      <div className="bg-muted/20 w-16 shrink-0 border-r" />

      {/* Day headers */}
      {weekDays.map((day) => {
        const isTodayDate = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 border-r py-2 last:border-r-0",
              isTodayDate && "bg-primary/5",
            )}
          >
            <span className="text-muted-foreground text-xs font-medium uppercase">{format(day, "EEE")}</span>
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                isTodayDate && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
