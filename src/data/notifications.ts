import { Bell, CheckCircle2, RefreshCw, UserPlus } from "lucide-react";

import type { Notification, NotificationConfig } from "@/types/notifications";

export const notificationConfigs: Record<string, NotificationConfig> = {
  meeting_confirmed: {
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-600 dark:text-green-500",
    label: "Meeting confirmed",
  },
  reminder: {
    icon: Bell,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    label: "Reminder",
  },
  event_updated: {
    icon: RefreshCw,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-500",
    label: "Event updated",
  },
  new_participant: {
    icon: UserPlus,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-500",
    label: "New participant",
  },
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "meeting_confirmed",
    title: "Meeting confirmed",
    message: "Daily checkin has been confirmed for tomorrow at 9:00 AM",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Reminder",
    message: "Team Standup starts in 30 minutes",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    eventId: "morning-standup",
  },
  {
    id: "3",
    type: "event_updated",
    title: "Event updated",
    message: "Design Workshop time has been changed to 2:00 PM",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: false,
    eventId: "design-workshop",
  },
  {
    id: "4",
    type: "new_participant",
    title: "New participant",
    message: "Sarah joined the Sprint Planning meeting",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
    eventId: "sprint-planning",
  },
  {
    id: "5",
    type: "meeting_confirmed",
    title: "Meeting confirmed",
    message: "1:1 with Alex scheduled for Friday at 3:00 PM",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: true,
  },
];
