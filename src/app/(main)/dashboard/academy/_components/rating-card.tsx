import { Circle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getAverageClassRating } from "@/data/mock-academy-data";

export function RatingCard() {
  const rating = getAverageClassRating("C001");
  const maxRating = 100;
  const percentage = Math.round((rating / maxRating) * 100);

  return (
    <Card className="border-border/50 bg-card border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
        <div className="flex-1">
          <div className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Focus</div>
          <div className="mt-1 text-3xl font-bold">{percentage}%</div>
        </div>
        <div className="text-muted-foreground text-right text-base">score</div>
      </div>
    </Card>
  );
}
