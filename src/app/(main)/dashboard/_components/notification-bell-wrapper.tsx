"use client";

import { useRouter } from "next/navigation";

import { mockEvents } from "@/app/(main)/dashboard/calendar/_data/events";

import { NotificationBell } from "./notification-bell";

export function NotificationBellWrapper() {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    // Find the event in mock events
    const event = mockEvents.find((e) => e.id === eventId);

    if (event) {
      // Navigate to calendar page with event ID in URL
      router.push(`/dashboard/calendar?eventId=${eventId}`);
    }
  };

  return <NotificationBell onEventClick={handleEventClick} />;
}
