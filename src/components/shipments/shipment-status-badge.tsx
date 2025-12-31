import { Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types/shipment";

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string; dotColor: string }> = {
  draft: {
    label: "Draft",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground dark:bg-muted/50",
    dotColor: "text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-400",
    dotColor: "text-blue-600 dark:text-blue-400",
  },
  arrived: {
    label: "Arrived",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/50 dark:text-green-400",
    dotColor: "text-green-600 dark:text-green-400",
  },
  canceled: {
    label: "Canceled",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400",
    dotColor: "text-red-600 dark:text-red-400",
  },
  delayed: {
    label: "Delayed",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/50 dark:bg-orange-950/50 dark:text-orange-400",
    dotColor: "text-orange-600 dark:text-orange-400",
  },
};

export function ShipmentStatusBadge({ status, className }: ShipmentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn("gap-1.5", config.className, className)}>
      <Circle className={cn("size-2 fill-current", config.dotColor)} />
      {config.label}
    </Badge>
  );
}
