"use client";

import { useState, createElement } from "react";

import { BookOpen, CheckCircle2, Circle, Clock, Target, TrendingUp, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CurriculumTopic } from "@/data/mock-academy-data";
import { cn } from "@/lib/utils";
import { useAcademyStore } from "@/stores/use-academy-store";

const statusConfig = {
  "not-started": {
    label: "Not Started",
    icon: Circle,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
  },
};

export default function CurriculumPage() {
  const curriculum = useAcademyStore((state) => state.curriculum);
  const updateCurriculumProgress = useAcademyStore((state) => state.updateCurriculumProgress);
  const updateCurriculumStatus = useAcademyStore((state) => state.updateCurriculumStatus);
  const teacher = useAcademyStore((state) => state.teacher);

  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Get unique subjects
  const subjects = ["all", ...new Set(curriculum.map((c) => c.subject))];

  const filteredCurriculum =
    selectedSubject === "all" ? curriculum : curriculum.filter((c) => c.subject === selectedSubject);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilTarget = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  // Calculate overall stats
  const totalUnits = curriculum.length;
  const completedUnits = curriculum.filter((c) => c.status === "completed").length;
  const inProgressUnits = curriculum.filter((c) => c.status === "in-progress").length;
  const notStartedUnits = curriculum.filter((c) => c.status === "not-started").length;
  const overallProgress = Math.round(curriculum.reduce((sum, c) => sum + c.progress, 0) / totalUnits);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Progress</h1>
          <p className="text-muted-foreground">Track your teaching progress across all subjects</p>
        </div>
        <Button>
          <Target className="mr-2 h-4 w-4" />
          Set Goals
        </Button>
      </div>

      {/* Overall Progress Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Total Progress</p>
              <p className="text-3xl font-bold">{overallProgress}%</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">{completedUnits}</div>
                <div className="text-muted-foreground text-xs">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{inProgressUnits}</div>
                <div className="text-muted-foreground text-xs">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-500">{notStartedUnits}</div>
                <div className="text-muted-foreground text-xs">Not Started</div>
              </div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Filter by subject:</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-muted-foreground ml-auto text-sm">
              Showing {filteredCurriculum.length} of {totalUnits} units
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Units */}
      <div className="grid gap-4">
        {filteredCurriculum.map((unit) => {
          const config = statusConfig[unit.status];
          const isOverdue = new Date(unit.targetDate) < new Date() && unit.status !== "completed";

          return (
            <Card
              key={unit.id}
              className={cn(
                "transition-all hover:shadow-md",
                unit.status === "completed" && "border-green-500/50",
                isOverdue && "border-red-500/50",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{unit.unit}</CardTitle>
                      <Badge variant="outline" className={cn(config.borderColor, config.color)}>
                        {createElement(config.icon, { className: "mr-1 h-3 w-3" })}
                        {config.label}
                      </Badge>
                      {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">{unit.subject}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Unit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Topics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Standards */}
                {unit.standards && unit.standards.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Learning Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {unit.standards.map((standard, index) => (
                        <Badge key={index} variant="outline" className="font-mono text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">{unit.progress}%</span>
                  </div>
                  <Progress value={unit.progress} className="h-2" />
                </div>

                {/* Target Date and Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-semibold">{formatDate(unit.targetDate)}</span>
                    <span className={cn("text-xs", isOverdue && "text-red-500")}>
                      ({getDaysUntilTarget(unit.targetDate)})
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {unit.status !== "completed" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newProgress = Math.min(unit.progress + 10, 100);
                            updateCurriculumProgress(unit.id, newProgress);
                            if (newProgress === 100) {
                              updateCurriculumStatus(unit.id, "completed");
                            }
                          }}
                        >
                          Update Progress
                        </Button>
                        {unit.status === "not-started" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              updateCurriculumStatus(unit.id, "in-progress");
                              updateCurriculumProgress(unit.id, 10);
                            }}
                          >
                            Start Unit
                          </Button>
                        )}
                        {unit.status === "in-progress" && unit.progress >= 90 && (
                          <Button
                            size="sm"
                            onClick={() => {
                              updateCurriculumStatus(unit.id, "completed");
                              updateCurriculumProgress(unit.id, 100);
                            }}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredCurriculum.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl opacity-20">📚</div>
              <h3 className="mb-2 text-lg font-semibold">No Curriculum Units Found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {selectedSubject === "all"
                  ? "You haven't added any curriculum units yet."
                  : `No curriculum units found for ${selectedSubject}.`}
              </p>
              <Button>
                <Target className="mr-2 h-4 w-4" />
                Add Curriculum Unit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
