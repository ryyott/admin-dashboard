"use client";

import { Calendar, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UpcomingEvent } from "@/data/mock-academy-data";

interface EventDetailSheetProps {
  event: UpcomingEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const eventTypeColors: Record<string, string> = {
  meeting: "#3b82f6",
  exam: "#ef4444",
  workshop: "#8b5cf6",
  fieldTrip: "#10b981",
  assembly: "#f59e0b",
};

const eventTypeLabels: Record<string, string> = {
  meeting: "Meeting",
  exam: "Exam",
  workshop: "Workshop",
  fieldTrip: "Field Trip",
  assembly: "Assembly",
};

export function EventDetailSheet({ event, isOpen, onClose }: EventDetailSheetProps) {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="px-6 pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${eventTypeColors[event.type]}20` }}
            >
              <Calendar className="h-8 w-8" style={{ color: eventTypeColors[event.type] }} />
            </div>
            <div className="space-y-2">
              <Badge
                className="px-3 py-1 text-xs"
                style={{
                  backgroundColor: eventTypeColors[event.type] || "#6b7280",
                }}
              >
                {eventTypeLabels[event.type] || "Event"}
              </Badge>
              <SheetTitle className="text-2xl font-bold">{event.title}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6 px-6 pb-6">
          {/* Date & Time */}
          <div className="space-y-4">
            <div className="bg-muted/30 flex items-start gap-4 rounded-lg p-4">
              <div className="bg-background flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <Calendar className="text-foreground h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground mb-1 text-sm font-medium">Date</p>
                <p className="text-base font-semibold">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="bg-muted/30 flex items-start gap-4 rounded-lg p-4">
              <div className="bg-background flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <Clock className="text-foreground h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground mb-1 text-sm font-medium">Time</p>
                <p className="text-base font-semibold">{event.time}</p>
              </div>
            </div>

            <div className="bg-muted/30 flex items-start gap-4 rounded-lg p-4">
              <div className="bg-background flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <MapPin className="text-foreground h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground mb-1 text-sm font-medium">Location</p>
                <p className="text-base font-semibold">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-3">
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Description</h3>
              <p className="text-foreground/80 bg-muted/30 rounded-lg p-4 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Additional Details */}
          <div className="border-border/50 bg-muted/30 space-y-4 rounded-lg border p-5">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Event Details</h3>

            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Event Type</span>
              <span className="text-sm font-semibold">{eventTypeLabels[event.type]}</span>
            </div>

            <div className="bg-border/50 h-px" />

            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge variant="secondary">Upcoming</Badge>
            </div>
          </div>

          {/* Action Info */}
          <div className="border-border/50 bg-primary/5 rounded-lg border p-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              This event is scheduled and confirmed. Make sure to mark your calendar and prepare any necessary
              materials.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
