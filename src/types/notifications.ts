import type { LucideIcon } from "lucide-react";

export type NotificationType = "meeting_confirmed" | "reminder" | "event_updated" | "new_participant";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  eventId?: string;
}

export interface NotificationConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}
