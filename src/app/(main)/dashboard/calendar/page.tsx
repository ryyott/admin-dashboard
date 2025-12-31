"use client";

import { CalendarControls } from "./_components/calendar-controls";
import { CalendarHeader } from "./_components/calendar-header";
import { getWeekDays } from "./_components/calendar-utils";
import { CalendarView } from "./_components/calendar-view";
import { CalendarWeekHeader } from "./_components/calendar-week-header";
import { EventSheetProvider } from "./_hooks/use-event-sheet";
import { useCalendarStore } from "./_store/calendar-store";

export default function CalendarPage() {
  const { currentWeekStart } = useCalendarStore();
  const weekDays = getWeekDays(currentWeekStart);

  return (
    <EventSheetProvider>
      {/* Sticky calendar header section - sticks below the global app header */}
      <section className="bg-background sticky top-4 z-30 -mx-4 -mt-4 px-4 pt-4 pb-4 md:top-6 md:-mx-6 md:-mt-6 md:px-6 md:pt-6">
        {/* Page title + actions */}
        <div className="mb-4">
          <CalendarHeader />
        </div>

        {/* Search + navigation controls */}
        <div className="mb-4">
          <CalendarControls />
        </div>

        {/* Day header strip */}
        <div className="bg-background overflow-hidden rounded-t-lg border border-b-0 shadow-sm">
          <CalendarWeekHeader weekDays={weekDays} />
        </div>
      </section>

      {/* Calendar grid - scrolls under the sticky header */}
      <CalendarView weekDays={weekDays} />
    </EventSheetProvider>
  );
}
