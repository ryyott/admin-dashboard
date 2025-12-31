"use client";

import { useState } from "react";

import Link from "next/link";

import { ClipboardList, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HomeworkItem } from "@/data/mock-academy-data";
import { cn } from "@/lib/utils";
import { useAcademyStore } from "@/stores/use-academy-store";

import { HomeworkDetailSheet } from "./homework-detail-sheet";

const statusConfig = {
  todo: {
    label: "To do",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  "on-review": {
    label: "On review",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  completed: {
    label: "Completed",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
};

export function HomeworkProgress() {
  const homework = useAcademyStore((state) => state.homework);
  const homeworkFilter = useAcademyStore((state) => state.homeworkFilter);
  const setHomeworkFilter = useAcademyStore((state) => state.setHomeworkFilter);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredHomework = homeworkFilter === "all" ? homework : homework.filter((h) => h.status === homeworkFilter);

  const handleHomeworkClick = (item: HomeworkItem) => {
    setSelectedHomework(item);
    setIsSheetOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Overdue";

    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Group homework by status
  const groupedHomework = {
    todo: homework.filter((h) => h.status === "todo"),
    "on-review": homework.filter((h) => h.status === "on-review"),
    completed: homework.filter((h) => h.status === "completed"),
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Homework (Next Due)
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 text-sm font-semibold" asChild>
            <Link href="/dashboard/academy/homework">view all →</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Homework list - Compact rows */}
          <div className="divide-border divide-y">
            {homework.slice(0, 4).map((item) => {
              const overdue = isOverdue(item.dueDate) && item.status === "todo";
              const config = statusConfig[item.status];
              const submissionRate = Math.round((item.submittedCount / item.totalStudents) * 100);

              return (
                <div
                  key={item.id}
                  className="hover:bg-muted/50 flex cursor-pointer items-center justify-between px-5 py-4 transition-colors"
                  onClick={() => handleHomeworkClick(item)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Circle
                      className={cn(
                        "h-2 w-2 flex-shrink-0",
                        item.status === "completed" ? "fill-green-500 text-green-500" : config.color,
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-medium">{item.title}</h4>
                        {overdue && (
                          <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">{item.subject}</p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-medium">Due {formatDate(item.dueDate)}</p>
                      <p className="text-muted-foreground text-xs">{submissionRate}% submitted</p>
                    </div>
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                      <span className="text-xs font-bold">{submissionRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <HomeworkDetailSheet homework={selectedHomework} isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}
