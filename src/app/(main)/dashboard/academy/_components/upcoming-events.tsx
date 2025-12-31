"use client";

import { useState } from "react";

import Image from "next/image";

import { CalendarDays, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UpcomingEvent } from "@/data/mock-academy-data";
import { useAcademyStore } from "@/stores/use-academy-store";

import { EventDetailSheet } from "./event-detail-sheet";

const eventTypeColors: Record<string, string> = {
  meeting: "bg-blue-500",
  exam: "bg-red-500",
  event: "bg-green-500",
  "professional-development": "bg-purple-500",
};

const eventTypeLabels: Record<string, string> = {
  meeting: "Meeting",
  exam: "Exam",
  event: "Event",
  "professional-development": "Workshop",
};

export function UpcomingEvents() {
  const getUpcomingEvents = useAcademyStore((state) => state.getUpcomingEvents);
  const events = getUpcomingEvents();
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleEventClick = (event: UpcomingEvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Events list - Compact rows */}
          <div className="divide-border divide-y">
            {events.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="hover:bg-muted/50 flex cursor-pointer items-center justify-between px-5 py-4 transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Circle
                    className="h-2 w-2 flex-shrink-0"
                    style={{
                      fill: eventTypeColors[event.type] || "#6b7280",
                      color: eventTypeColors[event.type] || "#6b7280",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-medium">{event.title}</h4>
                      <Badge
                        className="h-4 px-1 text-[10px]"
                        style={{
                          backgroundColor: eventTypeColors[event.type] || "#6b7280",
                        }}
                      >
                        {eventTypeLabels[event.type] || "Event"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-medium">{event.time}</p>
                    <p className="text-muted-foreground text-xs">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EventDetailSheet event={selectedEvent} isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}
