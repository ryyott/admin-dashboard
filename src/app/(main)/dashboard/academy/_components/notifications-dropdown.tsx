"use client";

import { useState } from "react";

import { Bell, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockNotifications, formatRelativeTime, type Notification } from "@/data/mock-notifications";
import { cn } from "@/lib/utils";

const notificationTypeStyles = {
  info: "border-l-blue-500 bg-blue-500/5",
  success: "border-l-green-500 bg-green-500/5",
  warning: "border-l-orange-500 bg-orange-500/5",
  event: "border-l-purple-500 bg-purple-500/5",
};

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="hover:bg-background/15 active:bg-background/20 relative rounded-full p-2.5 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <span className="ring-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-xs">
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="text-muted-foreground/20 mb-2 h-12 w-12" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-muted-foreground text-xs">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group hover:bg-muted/50 relative border-l-4 px-4 py-3 transition-colors",
                    notificationTypeStyles[notification.type],
                    !notification.read && "bg-muted/30",
                  )}
                >
                  <div className="flex gap-3">
                    {notification.icon && <div className="flex-shrink-0 text-2xl">{notification.icon}</div>}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn("text-sm leading-tight font-semibold", !notification.read && "text-foreground")}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && <div className="bg-primary h-2 w-2 flex-shrink-0 rounded-full" />}
                      </div>
                      <p className="text-muted-foreground text-xs">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-[11px]">
                          {formatRelativeTime(notification.time)}
                        </span>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 px-2 text-xs"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive h-6 px-2 text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button variant="ghost" className="w-full text-xs" onClick={() => setOpen(false)}>
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
