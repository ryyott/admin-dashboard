import { addDays, format, startOfWeek } from "date-fns";

export type RsvpStatus = "yes" | "no" | "maybe" | "pending";

export interface Participant {
  email: string;
  name: string;
  status: RsvpStatus;
  isOrganizer?: boolean;
}

export interface Event {
  id: string;
  title: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  date: string; // YYYY-MM-DD format
  participants: Participant[];
  meetingLink?: string;
  timezone?: string;
  organizer: {
    name: string;
    email: string;
    phone?: string;
  };
  location?: string;
  description?: string;
  notes?: string;
  reminder?: number; // minutes before event
  color?: string;
}

// Helper function to get events for a specific date
export function getEventsForDate(events: Event[], date: string): Event[] {
  return events.filter((event) => event.date === date);
}

// Helper function to get events for a week
export function getEventsForWeek(events: Event[], weekDates: string[]): Event[] {
  return events.filter((event) => weekDates.includes(event.date));
}

// Generate comprehensive mock events across a week
export function generateSampleEvents(): Event[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  const events: Event[] = [];

  // Generate events for each day of the week
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDay = addDays(weekStart, dayOffset);
    const dateStr = format(currentDay, "yyyy-MM-dd");
    const dayName = format(currentDay, "EEEE");

    // Early morning events (some days)
    if (dayOffset % 2 === 0) {
      events.push({
        id: `early-${dayOffset}`,
        title: "Early Morning Workout",
        startTime: "06:00",
        endTime: "07:00",
        date: dateStr,
        participants: [],
        organizer: { name: "You", email: "you@example.com" },
        timezone: "GMT+7 Pontianak",
      });
    }

    // Morning standup (weekdays)
    if (dayOffset < 5) {
      events.push({
        id: `standup-${dayOffset}`,
        title: "Team Standup",
        startTime: "09:00",
        endTime: "09:30",
        date: dateStr,
        participants: [
          { email: "alice@example.com", name: "Alice Johnson", status: "yes", isOrganizer: true },
          { email: "bob@example.com", name: "Bob Smith", status: "yes" },
          { email: "charlie@example.com", name: "Charlie Davis", status: "maybe" },
        ],
        organizer: {
          name: "Alice Johnson",
          email: "alice@example.com",
          phone: "+1 904-330-1131",
        },
        meetingLink: "https://meet.google.com/standup-daily",
        timezone: "GMT+7 Pontianak",
        reminder: 15,
        notes: `${dayName} standup - Quick sync on progress and blockers.`,
      });
    }

    // Mid-morning events
    if (dayOffset === 0) {
      events.push({
        id: `design-review-${dayOffset}`,
        title: "Design Review - Homepage Redesign",
        startTime: "10:30",
        endTime: "11:30",
        date: dateStr,
        participants: [
          { email: "sarah@example.com", name: "Sarah Designer", status: "yes", isOrganizer: true },
          { email: "mike@example.com", name: "Mike Developer", status: "yes" },
          { email: "emma@example.com", name: "Emma PM", status: "yes" },
        ],
        organizer: { name: "Sarah Designer", email: "sarah@example.com" },
        meetingLink: "https://meet.google.com/design-review",
        timezone: "GMT+7 Pontianak",
        reminder: 30,
        description: "Review final mockups for homepage redesign",
        notes: "Please review Figma files before the meeting. Link in description.",
      });
    }

    if (dayOffset === 1) {
      events.push({
        id: `product-planning-${dayOffset}`,
        title: "Product Review Meeting",
        startTime: "10:00",
        endTime: "11:30",
        date: dateStr,
        participants: [
          { email: "james@example.com", name: "James Brown", status: "yes", isOrganizer: true },
          { email: "sophia@example.com", name: "Sophia Williams", status: "yes" },
          { email: "leonel@example.com", name: "Leonel Ngoya", status: "yes" },
          { email: "diana@example.com", name: "Diana Chen", status: "pending" },
        ],
        organizer: { name: "James Brown", email: "james@example.com", phone: "+1 555-123-4567" },
        meetingLink: "https://meet.google.com/product-review",
        timezone: "GMT+7 Pontianak",
        reminder: 30,
        description: "Review Q4 product roadmap and feature prioritization",
        notes:
          "During today's check-in, we had an in-depth discussion about the MVP. We agreed on the core features that need to be included, focusing on the AI-conducted interviews and the memoir compilation functionality.",
      });
    }

    // Lunch (every day)
    events.push({
      id: `lunch-${dayOffset}`,
      title: "Lunch Break",
      startTime: "12:00",
      endTime: "13:00",
      date: dateStr,
      participants: [],
      organizer: { name: "You", email: "you@example.com" },
      timezone: "GMT+7 Pontianak",
    });

    // Afternoon events
    if (dayOffset === 2) {
      events.push({
        id: `client-presentation-${dayOffset}`,
        title: "Client Presentation",
        startTime: "14:00",
        endTime: "15:30",
        date: dateStr,
        participants: [
          { email: "alice@example.com", name: "Alice Johnson", status: "yes", isOrganizer: true },
          { email: "bob@example.com", name: "Bob Smith", status: "yes" },
          { email: "client@external.com", name: "Sarah Client", status: "pending" },
        ],
        organizer: { name: "Alice Johnson", email: "alice@example.com", phone: "+1 904-330-1131" },
        meetingLink: "https://meet.google.com/client-meeting",
        timezone: "GMT+7 Pontianak",
        reminder: 60,
        location: "Conference Room A",
        description: "Quarterly business review with key stakeholders",
        notes: "Please prepare slides covering: Q3 results, Q4 projections, new feature demos, and pricing updates.",
      });
    }

    if (dayOffset === 3) {
      events.push({
        id: `sprint-planning-${dayOffset}`,
        title: "Sprint Planning",
        startTime: "13:30",
        endTime: "15:30",
        date: dateStr,
        participants: [
          { email: "scrum@example.com", name: "Scrum Master", status: "yes", isOrganizer: true },
          { email: "dev1@example.com", name: "Developer One", status: "yes" },
          { email: "dev2@example.com", name: "Developer Two", status: "yes" },
          { email: "dev3@example.com", name: "Developer Three", status: "yes" },
          { email: "qa@example.com", name: "QA Engineer", status: "yes" },
        ],
        organizer: { name: "Scrum Master", email: "scrum@example.com" },
        meetingLink: "https://meet.google.com/sprint-planning",
        timezone: "GMT+7 Pontianak",
        reminder: 30,
        description: "Plan next sprint stories and estimate effort",
        notes: "Review backlog items. Bring questions about user stories.",
      });
    }

    // Late afternoon
    if (dayOffset === 4) {
      events.push({
        id: `all-hands-${dayOffset}`,
        title: "All Hands Meeting",
        startTime: "16:00",
        endTime: "17:00",
        date: dateStr,
        participants: [
          { email: "ceo@example.com", name: "CEO", status: "yes", isOrganizer: true },
          { email: "team1@example.com", name: "Team Member", status: "yes" },
          { email: "team2@example.com", name: "Team Member", status: "yes" },
        ],
        organizer: { name: "CEO", email: "ceo@example.com" },
        meetingLink: "https://meet.google.com/all-hands",
        timezone: "GMT+7 Pontianak",
        reminder: 30,
        description: "Monthly company-wide meeting",
        notes: "Company updates, Q&A session, and team celebrations.",
      });
    }

    // Code reviews and 1-on-1s (various days)
    if (dayOffset % 3 === 0 && dayOffset < 5) {
      events.push({
        id: `code-review-${dayOffset}`,
        title: "Code Review Session",
        startTime: "15:00",
        endTime: "15:45",
        date: dateStr,
        participants: [
          { email: "senior@example.com", name: "Senior Developer", status: "yes", isOrganizer: true },
          { email: "junior@example.com", name: "Junior Developer", status: "yes" },
        ],
        organizer: { name: "Senior Developer", email: "senior@example.com" },
        timezone: "GMT+7 Pontianak",
        reminder: 15,
        notes: "Review PRs #234, #235, and #237. Focus on security and performance.",
      });
    }

    // Evening events (some days)
    if (dayOffset === 4) {
      events.push({
        id: `team-dinner-${dayOffset}`,
        title: "Team Dinner",
        startTime: "18:30",
        endTime: "20:00",
        date: dateStr,
        participants: [
          { email: "team1@example.com", name: "Team Member 1", status: "yes" },
          { email: "team2@example.com", name: "Team Member 2", status: "yes" },
          { email: "team3@example.com", name: "Team Member 3", status: "maybe" },
        ],
        organizer: { name: "Team Member 1", email: "team1@example.com" },
        location: "Italian Restaurant Downtown",
        timezone: "GMT+7 Pontianak",
        reminder: 60,
        description: "Monthly team social",
      });
    }

    // Random shorter events throughout the day
    if (dayOffset === 1 || dayOffset === 3) {
      events.push({
        id: `coffee-chat-${dayOffset}`,
        title: "Coffee Chat with UX",
        startTime: "11:00",
        endTime: "11:30",
        date: dateStr,
        participants: [{ email: "ux@example.com", name: "UX Designer", status: "yes", isOrganizer: true }],
        organizer: { name: "UX Designer", email: "ux@example.com" },
        timezone: "GMT+7 Pontianak",
        reminder: 15,
        notes: "Casual chat about design system improvements.",
      });
    }
  }

  return events;
}

// Mock events data
export const mockEvents: Event[] = generateSampleEvents();
