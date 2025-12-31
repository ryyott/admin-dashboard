"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { mockEvents, type Event } from "../_data/events";
import { useCalendarStore } from "../_store/calendar-store";

import { filterEvents, groupEventsByDate, searchEvents } from "./calendar-utils";

interface EventSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventSelect: (event: Event) => void;
}

export function EventSearchDialog({ open, onOpenChange, onEventSelect }: EventSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { eventTypeFilter, participantFilter } = useCalendarStore();

  // Search and filter events
  const filteredEvents = useMemo(() => {
    let results = searchEvents(mockEvents, searchQuery);

    // Apply existing filters
    results = filterEvents(results, "", eventTypeFilter, participantFilter);

    return results;
  }, [searchQuery, eventTypeFilter, participantFilter]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    return groupEventsByDate(filteredEvents);
  }, [filteredEvents]);

  const handleSelect = (event: Event) => {
    onEventSelect(event);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search events by title, organizer, location, or notes..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {!searchQuery && (
          <div className="py-12 text-center">
            <Search className="text-muted-foreground/50 mx-auto size-12" />
            <p className="text-muted-foreground mt-4 text-sm">
              Search for events by title, organizer, location, or notes
            </p>
            <p className="text-muted-foreground mt-2 text-xs">Tip: Use ⌘K to quickly open this search</p>
          </div>
        )}

        <CommandEmpty>
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No events found for &quot;{searchQuery}&quot;</p>
            <p className="text-muted-foreground mt-2 text-xs">Try searching by title, organizer, or location</p>
          </div>
        </CommandEmpty>

        {groupedEvents.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.events.map((event) => (
              <CommandItem key={event.id} onSelect={() => handleSelect(event)} className="!py-3">
                <div className="flex w-full items-center gap-3">
                  {event.meetingLink && <div className="bg-primary size-2 shrink-0 rounded-full" />}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{event.title}</p>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>
                        {event.startTime} - {event.endTime}
                      </span>
                      <span>•</span>
                      <span>{event.organizer.name}</span>
                      {event.location && (
                        <>
                          <span>•</span>
                          <span className="truncate">{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
