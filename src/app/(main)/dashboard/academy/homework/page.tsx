"use client";

import { Plus, Calendar, Users, BookOpen, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAcademyStore } from "@/stores/use-academy-store";

const statusConfig = {
  todo: {
    label: "To Do",
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  "on-review": {
    label: "On Review",
    color: "bg-orange-500",
    textColor: "text-orange-500",
  },
  completed: {
    label: "Completed",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
};

export default function HomeworkPage() {
  const homework = useAcademyStore((state) => state.homework);
  const homeworkFilter = useAcademyStore((state) => state.homeworkFilter);
  const setHomeworkFilter = useAcademyStore((state) => state.setHomeworkFilter);

  const filteredHomework = homeworkFilter === "all" ? homework : homework.filter((h) => h.status === homeworkFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const getDaysUntilDue = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  // Calculate stats
  const todoCount = homework.filter((h) => h.status === "todo").length;
  const reviewCount = homework.filter((h) => h.status === "on-review").length;
  const completedCount = homework.filter((h) => h.status === "completed").length;
  const totalSubmissions = homework.reduce((sum, h) => sum + h.submittedCount, 0);
  const totalStudents = homework.reduce((sum, h) => sum + h.totalStudents, 0);
  const avgSubmissionRate = totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Homework Management</h1>
          <p className="text-muted-foreground">Create, track, and grade homework assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Homework
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todoCount}</div>
                <div className="text-muted-foreground text-sm">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{reviewCount}</div>
                <div className="text-muted-foreground text-sm">Under Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-muted-foreground text-sm">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgSubmissionRate}%</div>
                <div className="text-muted-foreground text-sm">Avg Submission</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Filter by status:</label>
            <Select
              value={homeworkFilter}
              onValueChange={(value) => setHomeworkFilter(value as "all" | "todo" | "on-review" | "completed")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Homework</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="on-review">On Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-muted-foreground ml-auto text-sm">
              Showing {filteredHomework.length} of {homework.length} assignments
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homework List */}
      <div className="grid gap-4">
        {filteredHomework.map((hw) => {
          const submissionRate = Math.round((hw.submittedCount / hw.totalStudents) * 100);
          const gradingProgress = hw.submittedCount > 0 ? Math.round((hw.gradedCount / hw.submittedCount) * 100) : 0;
          const overdue = isOverdue(hw.dueDate) && hw.status === "todo";

          return (
            <Card key={hw.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{hw.title}</CardTitle>
                      <Badge className={cn("text-white", statusConfig[hw.status].color)}>
                        {statusConfig[hw.status].label}
                      </Badge>
                      {overdue && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">{hw.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4" />
                      Subject
                    </div>
                    <div className="font-semibold">{hw.subject}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </div>
                    <div className="font-semibold">
                      {formatDate(hw.dueDate)}
                      <span className={cn("ml-2 text-xs", overdue && "text-red-500")}>
                        ({getDaysUntilDue(hw.dueDate)})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      Assigned Date
                    </div>
                    <div className="font-semibold">{formatDate(hw.assignedDate)}</div>
                  </div>
                </div>

                {/* Submission Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submission Progress</span>
                    <span className="font-semibold">
                      {hw.submittedCount}/{hw.totalStudents} ({submissionRate}%)
                    </span>
                  </div>
                  <Progress value={submissionRate} className="h-2" />
                </div>

                {/* Grading Progress */}
                {hw.status === "on-review" && hw.submittedCount > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Grading Progress</span>
                      <span className="font-semibold">
                        {hw.gradedCount}/{hw.submittedCount} ({gradingProgress}%)
                      </span>
                    </div>
                    <Progress value={gradingProgress} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {hw.status === "todo" && (
                    <Button size="sm" variant="outline">
                      Edit Assignment
                    </Button>
                  )}
                  {hw.status === "on-review" && (
                    <Button size="sm" variant="default">
                      Grade Submissions
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Submissions
                  </Button>
                  <Button size="sm" variant="outline">
                    Send Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredHomework.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl opacity-20">📝</div>
              <h3 className="mb-2 text-lg font-semibold">No Homework Found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {homeworkFilter === "all"
                  ? "You haven't created any homework assignments yet."
                  : `No homework assignments with status "${statusConfig[homeworkFilter]?.label}".`}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create First Homework
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
