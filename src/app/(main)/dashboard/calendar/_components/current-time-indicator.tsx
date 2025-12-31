"use client";

import { calculateEventTop } from "./calendar-utils";

interface CurrentTimeIndicatorProps {
  currentTime: string;
}

export function CurrentTimeIndicator({ currentTime }: CurrentTimeIndicatorProps) {
  const topPosition = calculateEventTop(currentTime);

  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-10 flex items-center"
      style={{ top: `${topPosition}px` }}
    >
      <div className="bg-destructive size-2 rounded-full" />
      <div className="bg-destructive h-0.5 flex-1" />
    </div>
  );
}
