"use client";

import { useEffect, useRef, useState } from "react";

import { endOfWeek, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Filter, Search, UserX, Users, Video, VideoOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { EventTypeFilter, ParticipantFilter, useCalendarStore } from "../_store/calendar-store";

export function CalendarControls() {
  const {
    currentWeekStart,
    eventTypeFilter,
    participantFilter,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    setCurrentWeekStart,
    setEventTypeFilter,
    setParticipantFilter,
    resetFilters,
    setSearchDialogOpen,
  } = useCalendarStore();

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open search dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSearchDialogOpen]);

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekRangeText = `${format(currentWeekStart, "MMM dd")} - ${format(weekEnd, "MMM dd, yyyy")}`;

  const hasActiveFilters = eventTypeFilter !== EventTypeFilter.ALL || participantFilter !== ParticipantFilter.ALL;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          ref={searchInputRef}
          placeholder="Search events..."
          value=""
          readOnly
          onFocus={() => {
            searchInputRef.current?.blur();
            setSearchDialogOpen(true);
          }}
          onClick={() => setSearchDialogOpen(true)}
          className="cursor-pointer pr-16 pl-9"
        />
        <Kbd className="absolute top-1/2 right-2 hidden -translate-y-1/2 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </Kbd>
      </div>

      <div className="flex items-center gap-2">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon-sm" onClick={goToNextWeek}>
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Date Picker */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="min-w-[200px] justify-start">
              {weekRangeText}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={currentWeekStart}
              onSelect={(date) => {
                if (date) {
                  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                  setCurrentWeekStart(weekStart);
                  setDatePickerOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Filters */}
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className={cn(hasActiveFilters && "bg-accent text-accent-foreground")}
            >
              <Filter className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              <Separator />

              {/* Event Type Filter */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Event Type</p>
                <div className="space-y-1">
                  <Button
                    variant={eventTypeFilter === EventTypeFilter.ALL ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setEventTypeFilter(EventTypeFilter.ALL)}
                  >
                    All events
                  </Button>
                  <Button
                    variant={eventTypeFilter === EventTypeFilter.WITH_MEETING ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setEventTypeFilter(EventTypeFilter.WITH_MEETING)}
                  >
                    <Video className="mr-2 size-4" />
                    With meeting
                  </Button>
                  <Button
                    variant={eventTypeFilter === EventTypeFilter.WITHOUT_MEETING ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setEventTypeFilter(EventTypeFilter.WITHOUT_MEETING)}
                  >
                    <VideoOff className="mr-2 size-4" />
                    Without meeting
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Participant Filter */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Participants</p>
                <div className="space-y-1">
                  <Button
                    variant={participantFilter === ParticipantFilter.ALL ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setParticipantFilter(ParticipantFilter.ALL)}
                  >
                    All
                  </Button>
                  <Button
                    variant={participantFilter === ParticipantFilter.WITH_PARTICIPANTS ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setParticipantFilter(ParticipantFilter.WITH_PARTICIPANTS)}
                  >
                    <Users className="mr-2 size-4" />
                    With participants
                  </Button>
                  <Button
                    variant={participantFilter === ParticipantFilter.WITHOUT_PARTICIPANTS ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setParticipantFilter(ParticipantFilter.WITHOUT_PARTICIPANTS)}
                  >
                    <UserX className="mr-2 size-4" />
                    Without participants
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
