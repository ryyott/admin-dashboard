"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { NotificationBellWrapper } from "@/app/(main)/dashboard/_components/notification-bell-wrapper";
import { Button } from "@/components/ui/button";

import { CreateEventDialog } from "./create-event-dialog";
import { QuickSchedulePopover } from "./quick-schedule-popover";

export function CalendarHeader() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuickScheduleOpen, setIsQuickScheduleOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Calendar</h1>
          <p className="text-muted-foreground text-sm">Manage your events and schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBellWrapper />
          <QuickSchedulePopover open={isQuickScheduleOpen} onOpenChange={setIsQuickScheduleOpen} />
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="size-4" />
            New Event
          </Button>
        </div>
      </div>

      <CreateEventDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
