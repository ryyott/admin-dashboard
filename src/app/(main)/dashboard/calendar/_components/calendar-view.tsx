"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { format } from "date-fns";

import { mockEvents } from "../_data/events";
import { useEventSheet } from "../_hooks/use-event-sheet";
import { useCalendarStore } from "../_store/calendar-store";

import { CalendarControls } from "./calendar-controls";
import { CalendarDayColumn } from "./calendar-day-column";
import { CalendarTimeColumn } from "./calendar-time-column";
import { filterEvents, getCurrentTime, getEventsForDay } from "./calendar-utils";
import { CalendarWeekHeader } from "./calendar-week-header";
import { EventSearchDialog } from "./event-search-dialog";
import { EventSheet } from "./event-sheet";

interface CalendarViewProps {
  weekDays: Date[];
}

export function CalendarView({ weekDays }: CalendarViewProps) {
  const { searchQuery, eventTypeFilter, participantFilter, searchDialogOpen, setSearchDialogOpen } = useCalendarStore();
  const { selectedEvent, isSheetOpen, openEventSheet, setIsSheetOpen } = useEventSheet();
  const searchParams = useSearchParams();

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Handle eventId from URL (from notification clicks)
  useEffect(() => {
    const eventId = searchParams.get("eventId");
    if (eventId) {
      const event = mockEvents.find((e) => e.id === eventId);
      if (event) {
        openEventSheet(event);
      }
    }
  }, [searchParams, openEventSheet]);

  // Filter all events
  const filteredEvents = filterEvents(mockEvents, searchQuery, eventTypeFilter, participantFilter);

  // Organize events by day
  const eventsByDay = weekDays.map((day) => getEventsForDay(filteredEvents, day));

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleEventClick = openEventSheet;

  return (
    <>
      {/* Calendar grid */}
      <div className="bg-background flex w-full flex-col overflow-hidden rounded-lg rounded-t-none border border-t-0 shadow-sm">
        <div className="flex">
          <CalendarTimeColumn />
          <div className="flex flex-1">
            {weekDays.map((day, index) => (
              <CalendarDayColumn
                key={format(day, "yyyy-MM-dd")}
                date={day}
                events={eventsByDay[index]}
                currentTime={currentTime}
                onEventClick={handleEventClick}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      </div>

      <EventSheet event={selectedEvent} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <EventSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} onEventSelect={openEventSheet} />
    </>
  );
}
