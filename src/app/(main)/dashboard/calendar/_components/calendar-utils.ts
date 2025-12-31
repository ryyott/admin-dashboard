import { addDays, format, isToday as isTodayFns, isTomorrow } from "date-fns";

import type { Event } from "../_data/events";
import { EventTypeFilter, ParticipantFilter } from "../_store/calendar-store";

// Height of each hour row in pixels (matching Square UI)
export const HOUR_HEIGHT = 120;

// Get the 7 days of the week starting from a given date
export function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}

// Calculate duration between two times in minutes
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return endMinutes - startMinutes;
}

// Calculate the top position of an event based on start time
export function calculateEventTop(startTime: string): number {
  const [hour, minute] = startTime.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;
  // Each minute is HOUR_HEIGHT/60 px
  return (totalMinutes * HOUR_HEIGHT) / 60;
}

// Calculate the height of an event based on duration
export function calculateEventHeight(startTime: string, endTime: string): number {
  const duration = calculateDuration(startTime, endTime);
  // Each minute is HOUR_HEIGHT/60 px
  return (duration * HOUR_HEIGHT) / 60;
}

// Filter events based on search query and filters
export function filterEvents(
  events: Event[],
  searchQuery: string,
  eventTypeFilter: EventTypeFilter,
  participantFilter: ParticipantFilter,
): Event[] {
  return events.filter((event) => {
    // Search filter
    const matchesSearch = searchQuery === "" || event.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Event type filter
    let matchesEventType = true;
    if (eventTypeFilter === EventTypeFilter.WITH_MEETING) {
      matchesEventType = !!event.meetingLink;
    } else if (eventTypeFilter === EventTypeFilter.WITHOUT_MEETING) {
      matchesEventType = !event.meetingLink;
    }

    // Participant filter
    let matchesParticipant = true;
    if (participantFilter === ParticipantFilter.WITH_PARTICIPANTS) {
      matchesParticipant = event.participants.length > 0;
    } else if (participantFilter === ParticipantFilter.WITHOUT_PARTICIPANTS) {
      matchesParticipant = event.participants.length === 0;
    }

    return matchesSearch && matchesEventType && matchesParticipant;
  });
}

// Get events for a specific day
export function getEventsForDay(events: Event[], date: Date): Event[] {
  const dateStr = format(date, "yyyy-MM-dd");
  return events.filter((event) => event.date === dateStr);
}

// Check if a date is today
export function isToday(date: Date): boolean {
  return isTodayFns(date);
}

// Get current time in HH:MM format
export function getCurrentTime(): string {
  return format(new Date(), "HH:mm");
}

// Check if current time is within business hours (for showing time indicator)
export function isWithinBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 0 && hour < 24; // Show for all hours
}

// Generate hours array for the day in 12-hour format (12 AM to 11 PM)
export function generateHours(): string[] {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12; // Convert 0 to 12, and 13-23 to 1-11
    const period = i < 12 ? "AM" : "PM";
    return `${hour} ${period}`;
  });
}

// Search events across multiple fields
export function searchEvents(events: Event[], query: string): Event[] {
  if (!query || query.trim() === "") return events;

  const lowerQuery = query.toLowerCase().trim();

  return events.filter((event) => {
    // Title search
    if (event.title.toLowerCase().includes(lowerQuery)) return true;

    // Description search
    if (event.description?.toLowerCase().includes(lowerQuery)) return true;

    // Notes search
    if (event.notes?.toLowerCase().includes(lowerQuery)) return true;

    // Organizer search
    if (event.organizer.name.toLowerCase().includes(lowerQuery)) return true;
    if (event.organizer.email.toLowerCase().includes(lowerQuery)) return true;

    // Location search
    if (event.location?.toLowerCase().includes(lowerQuery)) return true;

    // Participant search
    if (
      event.participants.some(
        (p) => p.name.toLowerCase().includes(lowerQuery) || p.email.toLowerCase().includes(lowerQuery),
      )
    )
      return true;

    return false;
  });
}

// Sort events by proximity to current date
export function sortEventsByProximity(events: Event[]): Event[] {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");

  return [...events].sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    const aIsPast = a.date < today;
    const bIsPast = b.date < today;

    // Upcoming events before past events
    if (aIsPast && !bIsPast) return 1;
    if (!aIsPast && bIsPast) return -1;

    // Both upcoming: sort by date ASC (soonest first)
    if (!aIsPast && !bIsPast) {
      if (a.date !== b.date) {
        return aDate.getTime() - bDate.getTime();
      }
      return a.startTime.localeCompare(b.startTime);
    }

    // Both past: sort by date DESC (most recent first)
    if (a.date !== b.date) {
      return bDate.getTime() - aDate.getTime();
    }
    return b.startTime.localeCompare(a.startTime);
  });
}

// Get relative date label
export function getRelativeDateLabel(date: Date): string {
  if (isTodayFns(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE, MMMM d");
}

// Group events by date with proper ordering
export interface GroupedEvents {
  label: string;
  events: Event[];
  isPast: boolean;
  sortOrder: number;
}

export function groupEventsByDate(events: Event[]): GroupedEvents[] {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");
  const groups = new Map<string, Event[]>();

  // Sort events by proximity first
  const sortedEvents = sortEventsByProximity(events);

  sortedEvents.forEach((event) => {
    const eventDate = new Date(event.date);
    const isPast = event.date < today;

    let label: string;
    if (isPast) {
      label = "Past Events";
    } else {
      label = getRelativeDateLabel(eventDate);
    }

    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(event);
  });

  // Convert to array with proper ordering
  const result = Array.from(groups.entries()).map(([label, events]) => {
    const isPastGroup = label === "Past Events";
    return {
      label,
      events,
      isPast: isPastGroup,
      sortOrder: isPastGroup ? Number.MAX_SAFE_INTEGER : new Date(events[0].date).getTime(),
    };
  });

  // Sort groups: upcoming first, then past
  return result.sort((a, b) => a.sortOrder - b.sortOrder);
}

// Check if event is in given week
export function isEventInWeek(event: Event, weekStart: Date): boolean {
  const weekDays = getWeekDays(weekStart);
  return weekDays.some((day) => format(day, "yyyy-MM-dd") === event.date);
}
