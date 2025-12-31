"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Package, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { type ShipmentEvent } from "@/types/shipment";

interface ShipmentTimelineProps {
  events: ShipmentEvent[];
  className?: string;
}

const eventIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  delayed: Clock,
};

export function ShipmentTimeline({ events, className }: ShipmentTimelineProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {events.map((event, index) => {
        const Icon = eventIcons[event.status];
        const isCompleted = event.status === "completed";
        const isInProgress = event.status === "in_progress";
        const isDelayed = event.status === "delayed";
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex items-center">
            {/* Event Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Icon
                className={cn(
                  "size-5",
                  isCompleted && "fill-green-500 text-green-500 dark:fill-green-400 dark:text-green-400",
                  isInProgress && "animate-pulse text-blue-500 dark:text-blue-400",
                  isDelayed && "animate-pulse text-orange-500 dark:text-orange-400",
                  !isCompleted && !isInProgress && !isDelayed && "text-muted-foreground/30",
                )}
              />
            </motion.div>

            {/* Connector Line */}
            {!isLast && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
                className={cn(
                  "h-[2px] w-8 origin-left",
                  isCompleted ? "bg-green-500 dark:bg-green-400" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Detailed timeline with labels for expanded view
interface DetailedTimelineProps {
  events: ShipmentEvent[];
  className?: string;
}

export function DetailedShipmentTimeline({ events, className }: DetailedTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => {
        const isCompleted = event.status === "completed";
        const isInProgress = event.status === "in_progress";
        const isDelayed = event.status === "delayed";
        const isLast = index === events.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            {/* Timeline Line */}
            {!isLast && <div className="bg-border absolute top-8 left-[11px] h-full w-[2px]" />}

            {/* Icon */}
            <div className="relative z-10">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2",
                  isCompleted && "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400",
                  isInProgress && "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400",
                  isDelayed && "border-orange-500 bg-orange-500 dark:border-orange-400 dark:bg-orange-400",
                  !isCompleted && !isInProgress && !isDelayed && "border-muted-foreground/30 bg-background",
                )}
              >
                {isCompleted && <CheckCircle2 className="size-3 text-white" />}
                {isInProgress && <Clock className="size-3 text-white" />}
                {isDelayed && <Clock className="size-3 text-white" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isCompleted && "text-foreground",
                      !isCompleted && "text-muted-foreground",
                    )}
                  >
                    {event.label}
                  </p>
                  {event.location && (
                    <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
                      <MapPin className="size-3" />
                      {event.location}
                    </p>
                  )}
                </div>
                {event.timestamp && (
                  <p className="text-muted-foreground text-sm">
                    {new Date(event.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
