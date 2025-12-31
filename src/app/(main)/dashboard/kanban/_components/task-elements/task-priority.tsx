"use client";

import { AlertCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/kanban";

interface TaskPriorityProps {
  priority: Priority;
  className?: string;
}

export function TaskPriority({ priority, className }: TaskPriorityProps) {
  const priorityConfig = {
    urgent: {
      label: "Urgent",
      icon: AlertCircle,
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    high: {
      label: "High",
      icon: ArrowUp,
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
    medium: {
      label: "Medium",
      icon: Minus,
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    low: {
      label: "Low",
      icon: ArrowDown,
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
