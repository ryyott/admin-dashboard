"use client";

import { format, isPast, isToday, isTomorrow } from "date-fns";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";

interface TaskDueDateProps {
  dueDate?: Date;
  compact?: boolean;
  className?: string;
}

export function TaskDueDate({ dueDate, compact = false, className }: TaskDueDateProps) {
  if (!dueDate) return null;

  const overdue = isPast(dueDate) && !isToday(dueDate);
  const dueSoon = isToday(dueDate) || isTomorrow(dueDate);

  const dateText = compact
    ? format(dueDate, "MMM d")
    : isToday(dueDate)
      ? "Today"
      : isTomorrow(dueDate)
        ? "Tomorrow"
        : format(dueDate, "MMM d, yyyy");

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs",
        overdue && "text-red-600 dark:text-red-400",
        dueSoon && !overdue && "text-yellow-600 dark:text-yellow-400",
        !overdue && !dueSoon && "text-muted-foreground",
        className,
      )}
    >
      <Calendar className="h-3 w-3" />
      <span>{dateText}</span>
    </div>
  );
}
