"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TimetableContextType {
  isOpen: boolean;
  openTimetable: () => void;
  closeTimetable: () => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export function TimetableProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TimetableContext.Provider
      value={{
        isOpen,
        openTimetable: () => setIsOpen(true),
        closeTimetable: () => setIsOpen(false),
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error("useTimetable must be used within TimetableProvider");
  }
  return context;
}
