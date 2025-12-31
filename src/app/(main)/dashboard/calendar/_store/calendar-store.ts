import { addDays, startOfWeek } from "date-fns";
import { create } from "zustand";

// Event type filters
export enum EventTypeFilter {
  ALL = "all",
  WITH_MEETING = "with_meeting",
  WITHOUT_MEETING = "without_meeting",
}

// Participant filters
export enum ParticipantFilter {
  ALL = "all",
  WITH_PARTICIPANTS = "with_participants",
  WITHOUT_PARTICIPANTS = "without_participants",
}

interface CalendarStore {
  currentWeekStart: Date;
  searchQuery: string;
  eventTypeFilter: EventTypeFilter;
  participantFilter: ParticipantFilter;

  // Search dialog state
  searchDialogOpen: boolean;
  selectedEventId: string | null;
  highlightedEventId: string | null;

  // Actions
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  setCurrentWeekStart: (date: Date) => void;
  setSearchQuery: (query: string) => void;
  setEventTypeFilter: (filter: EventTypeFilter) => void;
  setParticipantFilter: (filter: ParticipantFilter) => void;
  resetFilters: () => void;

  // Search dialog actions
  setSearchDialogOpen: (open: boolean) => void;
  setSelectedEventId: (id: string | null) => void;
  setHighlightedEventId: (id: string | null) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
  searchQuery: "",
  eventTypeFilter: EventTypeFilter.ALL,
  participantFilter: ParticipantFilter.ALL,

  // Search dialog state
  searchDialogOpen: false,
  selectedEventId: null,
  highlightedEventId: null,

  goToNextWeek: () =>
    set((state) => ({
      currentWeekStart: addDays(state.currentWeekStart, 7),
    })),

  goToPreviousWeek: () =>
    set((state) => ({
      currentWeekStart: addDays(state.currentWeekStart, -7),
    })),

  goToToday: () =>
    set(() => ({
      currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
    })),

  setCurrentWeekStart: (date) =>
    set(() => ({
      currentWeekStart: startOfWeek(date, { weekStartsOn: 1 }),
    })),

  setSearchQuery: (query) => set(() => ({ searchQuery: query })),

  setEventTypeFilter: (filter) => set(() => ({ eventTypeFilter: filter })),

  setParticipantFilter: (filter) => set(() => ({ participantFilter: filter })),

  resetFilters: () =>
    set(() => ({
      searchQuery: "",
      eventTypeFilter: EventTypeFilter.ALL,
      participantFilter: ParticipantFilter.ALL,
    })),

  // Search dialog actions
  setSearchDialogOpen: (open) => set(() => ({ searchDialogOpen: open })),

  setSelectedEventId: (id) => set(() => ({ selectedEventId: id })),

  setHighlightedEventId: (id) => set(() => ({ highlightedEventId: id })),
}));
