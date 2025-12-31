"use client";

import { useState } from "react";

import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAcademyStore } from "@/stores/use-academy-store";

import { useTimetable } from "./timetable-context";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const currentDate = new Date("2024-03-28"); // Thursday

// Get dates for the week
function getWeekDates(baseDate: Date) {
  const dates = [];
  const day = baseDate.getDay();
  const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(diff + i);
    dates.push(date.getDate());
  }

  return dates;
}

const weekDates = getWeekDates(currentDate);
const currentDayIndex = 3; // Thursday (0-indexed from Monday)

export function TimetableSection() {
  const [selectedDay, setSelectedDay] = useState(currentDayIndex);
  const { isOpen, closeTimetable } = useTimetable();
  const classes = useAcademyStore((state) => state.classes);

  // Get classes for selected day
  const selectedDayName = daysOfWeek[selectedDay];
  const dayClasses = classes
    .flatMap((classInfo) =>
      classInfo.schedule
        .filter((s) => s.day === selectedDayName)
        .map((schedule) => ({
          ...schedule,
          subject: classInfo.subject,
          className: classInfo.name,
          classId: classInfo.id,
        })),
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Subject color mapping
  const subjectColors: Record<string, string> = {
    Mathematics: "bg-blue-500",
    Physics: "bg-purple-500",
    Chemistry: "bg-green-500",
    Biology: "bg-emerald-500",
    English: "bg-orange-500",
    History: "bg-amber-500",
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeTimetable}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Calendar className="text-primary h-4 w-4" />
            </div>
            Timetable
          </SheetTitle>
          <p className="text-muted-foreground text-sm">Mar 28, 2024</p>
        </SheetHeader>

        <div className="h-[calc(85vh-100px)] space-y-4 overflow-y-auto px-4 py-4">
          {/* Week Days Selector */}
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day, index) => {
              const isToday = index === currentDayIndex;
              const isSelected = index === selectedDay;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    "flex flex-col items-center rounded-xl p-2.5 text-xs transition-all",
                    isSelected && "bg-primary text-primary-foreground scale-105 shadow-sm",
                    !isSelected && isToday && "bg-primary/10 text-primary border-primary/20 border font-semibold",
                    !isSelected && !isToday && "hover:bg-muted border border-transparent",
                  )}
                >
                  <span className="mb-1 font-semibold">{day}</span>
                  <span className={cn("text-xs font-medium", isSelected && "font-bold")}>{weekDates[index]}</span>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            {/* Time indicator */}
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex h-7 w-14 items-center justify-center rounded-lg text-xs font-bold">
                10:15
              </div>
              <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
              <span className="text-muted-foreground text-xs">Current time</span>
            </div>

            {/* Class schedule */}
            {dayClasses.length > 0 ? (
              dayClasses.map((classItem, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    <span>{classItem.startTime}</span>
                    <div className="bg-border/50 h-px flex-1" />
                  </div>

                  <div className="group border-border/50 bg-card hover:border-primary/20 relative flex items-start gap-3 rounded-xl border p-3 transition-all hover:shadow-md">
                    <div
                      className={cn(
                        "absolute top-0 bottom-0 left-0 h-full w-1 rounded-full",
                        subjectColors[classItem.subject] || "bg-gray-500",
                      )}
                    />
                    <div className="flex-1 space-y-1.5 pl-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold">{classItem.subject}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {classItem.room}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <span>
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                        <span>•</span>
                        <span>Class {classItem.className}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
                <div className="mb-2 text-3xl">📅</div>
                <p className="text-muted-foreground text-sm font-medium">No classes scheduled</p>
                <p className="text-muted-foreground text-xs">Enjoy your day off!</p>
              </div>
            )}

            {/* Break indicator if present */}
            {selectedDay === currentDayIndex && (
              <div className="border-border/50 bg-muted/30 rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-sm font-medium">Break Time</span>
                  </div>
                  <span className="text-muted-foreground text-xs">10:00 - 10:30</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
