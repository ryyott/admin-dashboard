"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import type { Event as CalendarEvent } from "../_data/events";

interface EventSheetContextType {
  selectedEvent: CalendarEvent | null;
  isSheetOpen: boolean;
  openEventSheet: (event: CalendarEvent) => void;
  closeEventSheet: () => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setIsSheetOpen: (open: boolean) => void;
}

const EventSheetContext = createContext<EventSheetContextType | null>(null);

export function EventSheetProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openEventSheet = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  const closeEventSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <EventSheetContext.Provider
      value={{
        selectedEvent,
        isSheetOpen,
        openEventSheet,
        closeEventSheet,
        setSelectedEvent,
        setIsSheetOpen,
      }}
    >
      {children}
    </EventSheetContext.Provider>
  );
}

export function useEventSheet() {
  const context = useContext(EventSheetContext);
  if (!context) {
    throw new Error("useEventSheet must be used within EventSheetProvider");
  }
  return context;
}
