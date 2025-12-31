"use client";

import { CheckCircle2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TaskProgressProps {
  completed: number;
  total: number;
  progress: number;
  className?: string;
}

export function TaskProgress({ completed, total, progress, className }: TaskProgressProps) {
  if (total === 0) return null;

  const isComplete = completed === total;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <div className="text-muted-foreground flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>
            {completed}/{total}
          </span>
        </div>
        <span className={cn("text-muted-foreground", isComplete && "font-medium text-green-600")}>
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
