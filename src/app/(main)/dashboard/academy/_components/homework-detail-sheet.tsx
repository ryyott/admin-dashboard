"use client";

import { Calendar, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { HomeworkItem } from "@/data/mock-academy-data";
import { cn } from "@/lib/utils";

interface HomeworkDetailSheetProps {
  homework: HomeworkItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  todo: {
    label: "To Do",
    color: "fill-orange-500 text-orange-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600",
  },
  "on-review": {
    label: "On Review",
    color: "fill-blue-500 text-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
  completed: {
    label: "Completed",
    color: "fill-green-500 text-green-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
  },
};

export function HomeworkDetailSheet({ homework, isOpen, onClose }: HomeworkDetailSheetProps) {
  if (!homework) return null;

  const config = statusConfig[homework.status];
  const submissionRate = Math.round((homework.submittedCount / homework.totalStudents) * 100);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && homework.status === "todo";
  };

  const overdue = isOverdue(homework.dueDate);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="px-6 pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-xl", config.bgColor)}>
              <BookOpen className={cn("h-8 w-8", config.textColor)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge className={cn(config.bgColor, config.textColor, "border-0", "px-3 py-1 text-xs")}>
                  {homework.subject}
                </Badge>
                {overdue && (
                  <Badge variant="destructive" className="px-3 py-1 text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-2xl font-bold">{homework.title}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6 px-6 pb-6">
          {/* Due Date */}
          <div className="bg-muted/30 flex items-start gap-4 rounded-lg p-4">
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
                overdue ? "bg-destructive/10" : "bg-background",
              )}
            >
              <Calendar className={cn("h-6 w-6", overdue ? "text-destructive" : "text-foreground")} />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground mb-1 text-sm font-medium">Due Date</p>
              <p className={cn("text-base font-semibold", overdue && "text-destructive")}>
                {formatDate(homework.dueDate)}
              </p>
            </div>
          </div>

          {/* Submission Progress */}
          <div className="border-border/50 bg-muted/30 space-y-4 rounded-lg border p-5">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Submission Progress</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">Total Students</span>
                <span className="text-base font-semibold">{homework.totalStudents}</span>
              </div>

              <div className="bg-border/50 h-px" />

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">Submitted</span>
                <span className="text-base font-semibold text-green-600">{homework.submittedCount}</span>
              </div>

              <div className="bg-border/50 h-px" />

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">Pending</span>
                <span className="text-base font-semibold text-orange-600">
                  {homework.totalStudents - homework.submittedCount}
                </span>
              </div>

              <div className="bg-border/50 h-px" />

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold">{submissionRate}%</span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${submissionRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="border-border/50 bg-muted/30 space-y-4 rounded-lg border p-5">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Assignment Details</h3>

            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Subject</span>
              <span className="text-sm font-semibold">{homework.subject}</span>
            </div>

            <div className="bg-border/50 h-px" />

            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge className={cn(config.bgColor, config.textColor, "border-0")}>{config.label}</Badge>
            </div>

            <div className="bg-border/50 h-px" />

            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Assignment ID</span>
              <span className="font-mono text-sm">{homework.id}</span>
            </div>
          </div>

          {/* Action Items */}
          <div
            className={cn(
              "space-y-2 rounded-lg border p-5",
              overdue ? "border-destructive/50 bg-destructive/5" : "border-border/50 bg-primary/5",
            )}
          >
            <div className="flex items-start gap-2">
              {overdue ? (
                <AlertCircle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium">{overdue ? "Assignment Overdue" : "Next Steps"}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {overdue
                    ? `This assignment is overdue. Please follow up with students who haven't submitted yet.`
                    : homework.status === "on-review"
                      ? "Review submitted assignments and provide feedback to students."
                      : homework.status === "completed"
                        ? "All students have been graded. Assignment is complete."
                        : `Monitor submission progress and remind students about the upcoming deadline.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
