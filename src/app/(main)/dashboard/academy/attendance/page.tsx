"use client";

import { useState, createElement } from "react";

import { Calendar, Check, X, Clock, AlertCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AttendanceRecord } from "@/data/mock-academy-data";
import { cn } from "@/lib/utils";
import { useAcademyStore } from "@/stores/use-academy-store";

const statusConfig = {
  present: {
    label: "Present",
    icon: Check,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
  },
  absent: {
    label: "Absent",
    icon: X,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500",
  },
  late: {
    label: "Late",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500",
  },
  excused: {
    label: "Excused",
    icon: AlertCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
  },
};

export default function AttendancePage() {
  const classes = useAcademyStore((state) => state.classes);
  const students = useAcademyStore((state) => state.students);
  const getStudentsByClass = useAcademyStore((state) => state.getStudentsByClass);
  const attendanceRecords = useAcademyStore((state) => state.attendanceRecords);
  const markAttendance = useAcademyStore((state) => state.markAttendance);
  const dateFilter = useAcademyStore((state) => state.dateFilter);
  const setDateFilter = useAcademyStore((state) => state.setDateFilter);

  const [selectedClass, setSelectedClass] = useState("C001");

  const classStudents = getStudentsByClass(selectedClass);
  const selectedClassInfo = classes.find((c) => c.id === selectedClass);

  // Get attendance for selected date and class
  const getTodayAttendance = (studentId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find(
      (r) => r.studentId === studentId && r.classId === selectedClass && r.date === dateFilter,
    );
  };

  const handleMarkAttendance = (studentId: string, status: AttendanceRecord["status"]) => {
    markAttendance(studentId, selectedClass, status);
  };

  // Calculate stats
  const todayRecords = attendanceRecords.filter((r) => r.classId === selectedClass && r.date === dateFilter);
  const presentCount = todayRecords.filter((r) => r.status === "present").length;
  const absentCount = todayRecords.filter((r) => r.status === "absent").length;
  const lateCount = todayRecords.filter((r) => r.status === "late").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Tracking</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classInfo) => (
                  <SelectItem key={classInfo.id} value={classInfo.id}>
                    {classInfo.name} - {classInfo.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{classStudents.length}</div>
              <div className="text-muted-foreground text-sm">Total Students</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{presentCount}</div>
              <div className="text-muted-foreground text-sm">Present</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{absentCount}</div>
              <div className="text-muted-foreground text-sm">Absent</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{lateCount}</div>
              <div className="text-muted-foreground text-sm">Late</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedClassInfo?.name} - {selectedClassInfo?.subject}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classStudents.map((student) => {
              const attendance = getTodayAttendance(student.id);
              const status = attendance?.status;

              return (
                <div
                  key={student.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4 transition-all",
                    status && statusConfig[status].bgColor,
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-muted-foreground text-sm">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status && (
                      <Badge
                        variant="outline"
                        className={cn(statusConfig[status].borderColor, statusConfig[status].color)}
                      >
                        {createElement(statusConfig[status].icon, {
                          className: "mr-1 h-3 w-3",
                        })}
                        {statusConfig[status].label}
                      </Badge>
                    )}
                    <div className="flex gap-1">
                      {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((statusKey) => {
                        const config = statusConfig[statusKey];
                        const isActive = status === statusKey;

                        return (
                          <Button
                            key={statusKey}
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            onClick={() => handleMarkAttendance(student.id, statusKey)}
                            className={cn("h-8 w-8 p-0", isActive && config.bgColor, isActive && config.color)}
                            title={config.label}
                          >
                            {createElement(config.icon, {
                              className: "h-4 w-4",
                            })}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {classStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl opacity-20">📚</div>
              <h3 className="mb-2 text-lg font-semibold">No Students Found</h3>
              <p className="text-muted-foreground text-sm">This class doesn&apos;t have any students yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
