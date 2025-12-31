"use client";

import { formatDistanceToNow } from "date-fns";

import { notificationConfigs } from "@/data/notifications";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/stores/notifications/notifications-provider";
import type { Notification } from "@/types/notifications";

interface NotificationItemProps {
  notification: Notification;
  onEventClick?: (eventId: string) => void;
}

export function NotificationItem({ notification, onEventClick }: NotificationItemProps) {
  const markAsRead = useNotificationsStore((s) => s.markAsRead);
  const config = notificationConfigs[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to event if eventId exists
    if (notification.eventId && onEventClick) {
      onEventClick(notification.eventId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "hover:bg-accent flex w-full gap-3 px-4 py-3 text-left transition-colors",
        !notification.read && "bg-accent/50",
      )}
    >
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", config.color)}>
        <Icon className="size-4" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{notification.title}</p>
          {!notification.read && <span className="bg-primary size-2 shrink-0 rounded-full" />}
        </div>
        <p className="text-muted-foreground text-xs">{notification.message}</p>
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </p>
      </div>
    </button>
  );
}
