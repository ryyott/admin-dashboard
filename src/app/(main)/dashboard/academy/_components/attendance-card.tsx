import { Circle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getTodayAttendance } from "@/data/mock-academy-data";

export function AttendanceCard() {
  // Get today's attendance for the primary class
  const { present, total } = getTodayAttendance("C001");
  const percentage = Math.round((present / total) * 100);

  return (
    <Card className="border-border/50 bg-card border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Circle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
        <div className="flex-1">
          <div className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Attendance</div>
          <div className="mt-1 text-3xl font-bold">{percentage}%</div>
        </div>
        <div className="text-muted-foreground text-right text-base">
          {present}/{total}
        </div>
      </div>
    </Card>
  );
}
