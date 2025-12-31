"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Copy, Link2, Play } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { Event, RsvpStatus } from "../_data/events";

interface EventSheetProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventSheet({ event, open, onOpenChange }: EventSheetProps) {
  const [userRsvpStatus, setUserRsvpStatus] = useState<RsvpStatus>("pending");

  if (!event) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRsvp = (status: RsvpStatus) => {
    setUserRsvpStatus(status);
    // TODO: Send RSVP to backend
    console.log("RSVP:", status);
  };

  const handleProposeNewTime = () => {
    // TODO: Open time proposal dialog
    console.log("Propose new time");
  };

  const handleCopyMeetingLink = () => {
    if (event.meetingLink) {
      navigator.clipboard.writeText(event.meetingLink);
      // TODO: Show toast notification
    }
  };

  // Count RSVPs
  const rsvpCounts = event.participants.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<RsvpStatus, number>,
  );

  const totalParticipants = event.participants.length;
  const confirmedCount = rsvpCounts.yes || 0;

  // Parse date for display
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM d");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        {/* Header */}
        <div className="space-y-3 p-6 pb-4">
          <SheetTitle className="text-2xl leading-tight font-semibold">{event.title}</SheetTitle>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • {event.startTime} - {event.endTime} • {event.timezone || "UTC"}
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 space-y-0 overflow-y-auto">
          {/* Propose New Time Button */}
          <div className="border-y px-6 py-4">
            <Button
              variant="outline"
              className="w-full justify-between text-base font-normal"
              onClick={handleProposeNewTime}
            >
              <span>Propose new time</span>
              <span className="text-lg">↗</span>
            </Button>
          </div>

          {/* Participants */}
          {event.participants.length > 0 && (
            <div className="space-y-4 px-6 py-6">
              {event.participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.email}`}
                        alt={participant.name}
                      />
                      <AvatarFallback className="text-sm">{getInitials(participant.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participant.name}</span>
                        {participant.isOrganizer && (
                          <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
                            Organizer
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">{participant.email}</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full",
                      participant.status === "yes" && "bg-green-500 text-white",
                      participant.status === "no" && "bg-red-500/20 text-red-600",
                      participant.status === "maybe" && "bg-yellow-500/20 text-yellow-600",
                      participant.status === "pending" && "bg-muted",
                    )}
                  >
                    {participant.status === "yes" && (
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RSVP Buttons */}
          <div className="flex gap-3 border-y px-6 py-4">
            <Button
              variant={userRsvpStatus === "yes" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleRsvp("yes")}
            >
              Yes
            </Button>
            <Button
              variant={userRsvpStatus === "no" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleRsvp("no")}
            >
              No
            </Button>
            <Button
              variant={userRsvpStatus === "maybe" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleRsvp("maybe")}
            >
              Maybe
            </Button>
          </div>

          {/* Meeting Link Section */}
          {event.meetingLink && (
            <div className="space-y-4 border-b px-6 py-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex size-5 items-center justify-center rounded-full bg-green-500">
                  <Play className="size-3 fill-white text-white" />
                </div>
                <span className="font-medium">Meeting in Google Meet</span>
                <span className="text-muted-foreground ml-auto">Code: ABC DEFG HIJ</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="lg">
                  Join Google Meet meeting
                </Button>
                <Button variant="outline" size="lg" className="shrink-0" onClick={handleCopyMeetingLink}>
                  <Link2 className="size-4" />
                  Copy link
                </Button>
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-4 px-6 py-6">
            {/* Reminder */}
            {event.reminder && (
              <div className="flex items-center gap-3">
                <svg
                  className="text-muted-foreground size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="text-sm">Reminder: {event.reminder}min before</span>
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center gap-3">
              <svg
                className="text-muted-foreground size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Organizer: {event.organizer.email}</span>
            </div>

            {/* Phone */}
            {event.organizer.phone && (
              <div className="flex items-center gap-3">
                <svg
                  className="text-muted-foreground size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href={`tel:${event.organizer.phone}`} className="text-sm hover:underline">
                  {event.organizer.phone}
                </a>
              </div>
            )}

            {/* Attendance Count */}
            <div className="flex items-center gap-3">
              <svg
                className="text-muted-foreground size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm">
                {totalParticipants} {totalParticipants === 1 ? "person" : "persons"} • {confirmedCount} yes
              </span>
            </div>
          </div>

          {/* Notes from Organizer */}
          {event.notes && (
            <div className="space-y-3 border-t px-6 py-6">
              <div className="flex items-center gap-2">
                <svg
                  className="text-muted-foreground size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="font-medium">Notes from Organizer</h3>
              </div>
              <p className="text-foreground text-sm leading-relaxed">{event.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
