import { Circle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getHomeworkStats } from "@/data/mock-academy-data";

export function HomeworkCard() {
  const { assigned } = getHomeworkStats();

  return (
    <Card className="border-border/50 bg-card border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Circle className="h-4 w-4 fill-orange-500 text-orange-500" />
        <div className="flex-1">
          <div className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Homework</div>
          <div className="mt-1 text-3xl font-bold">{assigned}</div>
        </div>
        <div className="text-muted-foreground text-right text-base">due</div>
      </div>
    </Card>
  );
}
